import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request: Request) {
    try {
        const { email, password, name, role } = await request.json()

        if (!email || !password || !name || !role) {
            return NextResponse.json(
                { error: 'Email, password, name, and role are required' },
                { status: 400 }
            )
        }

        const supabaseAdmin = createAdminClient()

        // 1. Create the user in auth.users
        const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: { name, role }
        })

        if (authError) {
            console.error('Auth User Creation Error:', authError)
            return NextResponse.json({ error: authError.message }, { status: 500 })
        }

        // Note: Profiles are usually created by a database trigger (handle_new_user)
        // Check if the profile was created, or create it if not
        const { data: profile, error: profileError } = await supabaseAdmin
            .from('profiles')
            .select('*')
            .eq('id', authUser.user.id)
            .single()

        if (profileError || !profile) {
            // Manually create profile if trigger failed or didn't run yet
            const { error: insertError } = await supabaseAdmin
                .from('profiles')
                .insert({
                    id: authUser.user.id,
                    name,
                    role
                })

            if (insertError) {
                console.error('Profile Manual Insertion Error:', insertError)
            }
        } else {
            // Update profile just in case metadata wasn't picked up by trigger correctly
            await supabaseAdmin
                .from('profiles')
                .update({ name, role })
                .eq('id', authUser.user.id)
        }

        return NextResponse.json({ user: authUser.user })
    } catch (error) {
        console.error('Unexpected User Creation Error:', error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'An unexpected error occurred' },
            { status: 500 }
        )
    }
}
