import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
  
type columProps = {
    id: string
    productName: string
    size: string
    qty: number
    color: string
    price: string
    category: string
}

interface OrderDetailTableProps {
    data: columProps[]
}

export default function OrderDetailTable({ data }: OrderDetailTableProps) {

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Color</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Qty</TableHead>
            <TableHead className="text-right">Price</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item: columProps) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.productName}</TableCell>
              <TableCell>{item.size}</TableCell>
              <TableCell>{item.color}</TableCell>
              <TableCell>{item.category}</TableCell>
              <TableCell>{item.qty}</TableCell>
              <TableCell className="text-right">{item.price}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
}
  


