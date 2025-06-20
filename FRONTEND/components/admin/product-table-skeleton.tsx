import { Skeleton } from "@/components/ui/skeleton"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"

export function ProductTableSkeleton() {
  return (
    <Table>
      <TableHeader className="bg-gray-900">
        <TableRow className="border-gray-700 hover:bg-gray-900">
          <TableHead className="text-gray-400">Mã SP</TableHead>
          <TableHead className="text-gray-400">Tên sản phẩm</TableHead>
          <TableHead className="text-gray-400">Danh mục</TableHead>
          <TableHead className="text-gray-400">Giá</TableHead>
          <TableHead className="text-gray-400">Tồn kho</TableHead>
          <TableHead className="text-gray-400">Trạng thái</TableHead>
          <TableHead className="text-gray-400 text-right">Thao tác</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: 5 }).map((_, index) => (
          <TableRow key={index} className="border-gray-700">
            <TableCell>
              <Skeleton className="h-4 w-16 bg-gray-700" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-32 bg-gray-700" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-20 bg-gray-700" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-24 bg-gray-700" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-12 bg-gray-700" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-6 w-20 bg-gray-700 rounded-full" />
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Skeleton className="h-8 w-8 bg-gray-700" />
                <Skeleton className="h-8 w-8 bg-gray-700" />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
