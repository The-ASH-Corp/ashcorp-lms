import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowRight, Edit, Trash2 } from "lucide-react";
import Link from "next/link";


const topCourses = [
  {
    id: "#7",
    title: "Advance Photoshop Mastery Course",
    category: "Graphic Designing",
    views: "617",
    price: "₹9,999.00",
    instructor: "Mohammed Sufaid",
  },
  {
    id: "#1",
    title: "Flutter Development Mastery Course",
    category: "Flutter",
    views: "371",
    price: "₹9,999.00",
    instructor: "Muhammed Hunais Pc",
  },
  {
    id: "#6",
    title: "The Complete Digital Marketing Mastery Course",
    category: "Digital Marketing",
    views: "120",
    price: "₹9,999.00",
    instructor: "Fathima Nishni",
  },
  {
    id: "#8",
    title: "Advance Adobe Illustrator Mastery Course",
    category: "Graphic Designing",
    views: "104",
    price: "₹2,999.00",
    instructor: "hazeem",
  },
  {
    id: "#3",
    title: "Social Media Marketing Master Class",
    category: "Digital Marketing",
    views: "82",
    price: "₹2,999.00",
    instructor: "Fathimath Nishni",
  },
]

export default function Graphs() {
    return (
        <div className=" gap-6 xl:grid-cols-[1.6fr_1fr]">
        <Card className="border-0 bg-white shadow-sm mb-5">
          <CardHeader className="flex flex-col gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <CardTitle className="text-base font-semibold text-slate-900">
                Course & User Statistics
              </CardTitle>
              <p className="mt-1 text-sm text-slate-500">Daily course sales overview and user growth.</p>
            </div>
            <div className="inline-flex rounded-2xl bg-slate-100 p-1 text-sm text-slate-600">
              {[
                { label: "Daily", active: true },
                { label: "Monthly", active: false },
                { label: "Yearly", active: false },
              ].map((tab) => (
                <button
                  key={tab.label}
                  type="button"
                  className={`rounded-2xl px-3 py-2 font-medium transition ${
                    tab.active ? "bg-primary text-white" : "hover:text-slate-900"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </CardHeader>
          here add graphs 
        </Card>

        <Card className="border-0 bg-white shadow-sm">
          <CardHeader className="flex items-center justify-between ">
            <div>
              <CardTitle className="text-base font-semibold text-slate-900">
                Top Selling Course (Latest 5)
              </CardTitle>
              <p className="mt-1 text-sm text-slate-500">Latest performance by course.</p>
            </div>
            <Link href="/admin/courses" className="text-sm font-medium text-sky-600 transition hover:text-sky-700 flex items-center gap-2">
              View All Courses 
              <ArrowRight className="w-4 h-4"/>
            </Link>
          </CardHeader>
          <CardContent className="p-1">
            <Table>
              <TableHeader >
                <TableRow className="bg-slate-100">
                  <TableHead>ID</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Views</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Instructor</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topCourses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell className="font-medium text-slate-700">{course.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-2xl bg-slate-100" />
                        <div>
                          <p className="font-medium text-slate-900">{course.title}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{course.category}</TableCell>
                    <TableCell>{course.views}</TableCell>
                    <TableCell>{course.price}</TableCell>
                    <TableCell>{course.instructor}</TableCell>
                    <TableCell className="text-right">
                      <div className="inline-flex items-center gap-2">
                        <button className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:bg-slate-100">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-rose-600 transition hover:bg-rose-50">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    )
}