import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Users } from "lucide-react";

const topStudents = [
  { name: "shahana", email: "shaanaa2945@gmail.com", courses: 3 },
  { name: "Fazila Fadhila. Pc", email: "shaazeezpc@gmail.com", courses: 3 },
  { name: "Shahida", email: "kadeejashahida12@gmail.com", courses: 2 },
  { name: "Fathimathu Suhura.S.S", email: "fathimathusuhura4815@gmail.com", courses: 2 },
  { name: "Fathimath hanna .A", email: "fathimathhanna06@gmail.com", courses: 2 },
]

const topInstructors = [
  { name: "Fathima Nishni", total: 3, rating: "5.0" },
  { name: "Muhammed Hunais Pc", total: 1, rating: "5.0" },
  { name: "Husunul mubarak", total: 1, rating: "5.0" },
  { name: "Mohammed Sufaid", total: 1, rating: "5.0" },
  { name: "hazeem", total: 1, rating: "5.0" },
]


      export default function Lists () {
        return (
<div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card className="border-0 bg-white shadow-sm">
          <CardHeader className="flex items-center justify-between gap-4 border-b border-slate-200 p-5">
            <CardTitle className="text-base font-semibold text-slate-900">Top 5 Student</CardTitle>
            <span className="text-sm text-slate-500">Buy Courses</span>
          </CardHeader>
          <CardContent className="space-y-3 p-5">
            {topStudents.map((student) => (
              <div
                key={student.email}
                className="flex items-center justify-between rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-violet-100 text-primary">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{student.name}</p>
                    <p className="text-sm text-slate-500">{student.email}</p>
                  </div>
                </div>
                <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-sm font-medium text-slate-600">
                  Buy Courses : {student.courses}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-0 bg-white shadow-sm">
          <CardHeader className="flex items-center justify-between gap-4 border-b border-slate-200 p-5">
            <CardTitle className="text-base font-semibold text-slate-900">Top 5 Instructor</CardTitle>
            <span className="text-sm text-slate-500">Total Courses</span>
          </CardHeader>
          <CardContent className="space-y-3 p-5">
            {topInstructors.map((instructor) => (
              <div
                key={instructor.name}
                className="flex items-center justify-between rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-100 text-slate-700">
                    <GraduationCap className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{instructor.name}</p>
                    <p className="text-sm text-slate-500">{instructor.rating} ⭐</p>
                  </div>
                </div>
                <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-sm font-medium text-slate-600">
                  {instructor.total}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
        )
      }