import { DataTable } from "@/components/payment-history/Data-table";
import { ColumnDef } from "@tanstack/react-table";

interface Payment {
  Date: string;
  Invoice: string;
  Product: string;
  Type: string;
  Amount: string;
  Status: string;
  Actions: string;
}

const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "Date",
    header: "Date",
  },
  {
    accessorKey: "Invoice",
    header: "Invoice",
  },
  {
    accessorKey: "Product",
    header: "Product",
  },
  {
    accessorKey: "Type",
    header: "Type",
  },
  {
    accessorKey: "Amount",
    header: "Amount",
  },
  {
    accessorKey: "Status",
    header: "Status",
  },
  {
    accessorKey: "Actions",
    header: "Actions",
  },
]

export default function PaymentHistory() {
  return (
    <div className="p-5">
      <DataTable columns={columns} data={[]}/>
    </div>
  );
}