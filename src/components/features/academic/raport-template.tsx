

interface RaportTemplateProps {
    student: { name: string; nis: string }
    classData: { name: string; homeroom_teacher_name: string }
    semester: string
    academicYear: string
    grades: { subject: string; score: number }[]
    attendance: {
        hadir: number
        sakit: number
        izin: number
        alpha: number
    }
    date: string
}

export function RaportTemplate({
    student,
    classData,
    semester,
    academicYear,
    grades,
    attendance,
    date
}: RaportTemplateProps) {
    return (
        <div className="bg-white p-[2cm] w-[210mm] min-h-[297mm] mx-auto text-black shadow-none print:shadow-none print:p-0" id="raport-content">
            {/* Header Sekolah */}
            <div className="flex items-center gap-6 border-b-4 border-double border-black pb-4 mb-8">
                <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-300">
                    <span className="text-gray-400 text-xs font-bold uppercase text-center">Logo<br />Madrasah</span>
                </div>
                <div className="flex-1 text-center pr-24">
                    <h1 className="text-xl font-bold uppercase tracking-widest">YAYASAN KHAIRUL ULUM</h1>
                    <h2 className="text-2xl font-black uppercase">MADRASAH KHAIRUL ULUM</h2>
                    <p className="text-xs mt-1">Jl. Pendidikan No. 123, Kota Madrasah, Indonesia</p>
                    <p className="text-xs">Telp: (021) 1234567 • Email: info@khairululum.sch.id</p>
                </div>
            </div>

            {/* Judul Raport */}
            <h3 className="text-lg font-bold text-center underline mb-8 uppercase">LAPORAN HASIL BELAJAR SISWA</h3>

            {/* Info Siswa */}
            <div className="grid grid-cols-2 gap-x-12 gap-y-2 text-sm mb-8">
                <div className="grid grid-cols-[120px_10px_1fr]">
                    <span>Nama Siswa</span>
                    <span>:</span>
                    <span className="font-bold uppercase">{student?.name || '---'}</span>
                </div>
                <div className="grid grid-cols-[120px_10px_1fr]">
                    <span>Kelas</span>
                    <span>:</span>
                    <span>{classData?.name || '---'}</span>
                </div>
                <div className="grid grid-cols-[120px_10px_1fr]">
                    <span>NIS / NISN</span>
                    <span>:</span>
                    <span className="font-mono">{student?.nis || '---'}</span>
                </div>
                <div className="grid grid-cols-[120px_10px_1fr]">
                    <span>Semester</span>
                    <span>:</span>
                    <span>{semester}</span>
                </div>
                <div className="grid grid-cols-[120px_10px_1fr]">
                    <span>Madrasah</span>
                    <span>:</span>
                    <span>Madrasah Khairul Ulum</span>
                </div>
                <div className="grid grid-cols-[120px_10px_1fr]">
                    <span>Tahun Ajaran</span>
                    <span>:</span>
                    <span>{academicYear}</span>
                </div>
            </div>

            {/* Tabel Nilai */}
            <div className="mb-8">
                <h4 className="text-[10pt] font-bold mb-2">A. CAPAIAN KOMPETENSI</h4>
                <table className="w-full border-collapse border border-black text-sm">
                    <thead>
                        <tr>
                            <th className="border border-black p-2 w-[5%]" rowSpan={2}>No</th>
                            <th className="border border-black p-2 w-[35%]" rowSpan={2}>Mata Pelajaran</th>
                            <th className="border border-black p-2 w-[10%]" rowSpan={2}>KKM</th>
                            <th className="border border-black p-2" colSpan={3}>Nilai Pengetahuan</th>
                        </tr>
                        <tr>
                            <th className="border border-black p-1 w-[10%] text-center">Nilai</th>
                            <th className="border border-black p-1 w-[10%] text-center">Predikat</th>
                            <th className="border border-black p-1 text-center px-4">Deskripsi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {grades.map((g, idx) => (
                            <tr key={idx}>
                                <td className="border border-black p-2 text-center">{idx + 1}</td>
                                <td className="border border-black p-2 font-medium">{g.subject}</td>
                                <td className="border border-black p-2 text-center">75</td>
                                <td className="border border-black p-2 text-center font-bold">{g.score}</td>
                                <td className="border border-black p-2 text-center">{getPredicate(g.score)}</td>
                                <td className="border border-black p-2 text-[10px] leading-tight">
                                    {getDescription(g.subject, g.score)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Absensi */}
            <div className="w-[45%] mb-12">
                <h4 className="text-[10pt] font-bold mb-2">B. KETIDAKHADIRAN</h4>
                <table className="w-full border-collapse border border-black text-sm">
                    <tbody>
                        <tr>
                            <td className="border border-black p-2 w-48">1. Sakit</td>
                            <td className="border border-black p-2 text-center font-bold">{attendance.sakit} hari</td>
                        </tr>
                        <tr>
                            <td className="border border-black p-2">2. Izin</td>
                            <td className="border border-black p-2 text-center font-bold">{attendance.izin} hari</td>
                        </tr>
                        <tr>
                            <td className="border border-black p-2">3. Alpha</td>
                            <td className="border border-black p-2 text-center font-bold">{attendance.alpha} hari</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Tanda Tangan */}
            <div className="mt-auto pt-12">
                <div className="grid grid-cols-2 text-sm">
                    <div className="flex flex-col items-center">
                        <p className="mb-20 uppercase">Mengetahui,<br />Orang Tua / Wali</p>
                        <div className="w-48 border-b border-black"></div>
                        <p className="mt-1">(...................................................)</p>
                    </div>
                    <div className="flex flex-col items-center ml-auto">
                        <p className="mb-20">Masamba, {date}<br />Wali Kelas</p>
                        <div className="w-48 border-b border-black"></div>
                        <p className="mt-1 font-bold">( Ust. {classData?.homeroom_teacher_name || '................................'} )</p>
                    </div>
                </div>
                <div className="flex flex-col items-center mt-12 w-full">
                    <p className="mb-20 uppercase">Kepala Madrasah</p>
                    <div className="w-64 border-b border-black"></div>
                    <p className="mt-1 font-bold">UST. H. ABDULLAH SAID, M.Pd.I</p>
                    <p className="text-xs">NIP. 19700101 200003 1 001</p>
                </div>
            </div>

            {/* Footer Page Number */}
            <div className="print:hidden h-12" />
            <div className="text-[10px] text-gray-400 text-right mt-8 italic border-t pt-2">
                Dicetak otomatis melalui Sistem Manajemen Madrasah Khairul Ulum - {new Date().toLocaleString('id-ID')}
            </div>
        </div>
    )
}

function getPredicate(score: number) {
    if (score >= 90) return 'A'
    if (score >= 80) return 'B'
    if (score >= 70) return 'C'
    return 'D'
}

function getDescription(subject: string, score: number) {
    if (score >= 90) return `Sangat baik dalam memahami seluruh kompetensi pada mata pelajaran ${subject}, menunjukkan ketelitian dan pemahaman mendlalam.`
    if (score >= 80) return `Baik dalam memahami kompetensi dasar ${subject}, mampu menyelesaikan tugas dengan hasil memuaskan.`
    if (score >= 70) return `Cukup dalam memahami kompetensi dasar ${subject}, perlu peningkatan kedisiplinan dan latihan berkala.`
    return `Perlu bimbingan intensif dalam memahami dasar-dasar mata pelajaran ${subject}.`
}
