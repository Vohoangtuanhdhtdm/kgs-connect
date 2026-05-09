import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, X, Loader2, MapPin, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetchPendingListings } from "@/services/listings";
import { api } from "@/lib/api";
import { formatVnd } from "@/util/Helper";

export default function Admin() {
  const queryClient = useQueryClient();

  // 1. Lấy danh sách tin đang chờ duyệt
  const { data: listings, isLoading } = useQuery({
    queryKey: ["pending-listings"],
    queryFn: fetchPendingListings,
  });

  // 2. Mutation: Phê duyệt tin
  const approveMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.put(`/Properties/admin/${id}/approve`);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Đã phê duyệt tin đăng!");
      // Ra lệnh cho React Query tự động tải lại danh sách
      queryClient.invalidateQueries({ queryKey: ["pending-listings"] });
    },
    onError: () => toast.error("Có lỗi xảy ra khi phê duyệt."),
  });

  // 3. Mutation: Từ chối tin
  const rejectMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.put(`/Properties/admin/${id}/reject`);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Đã từ chối tin đăng.");
      queryClient.invalidateQueries({ queryKey: ["pending-listings"] });
    },
    onError: () => toast.error("Có lỗi xảy ra khi từ chối."),
  });

  return (
    <div className="container max-w-6xl py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">
          Quản trị — Tin chờ duyệt
        </h1>
        <p className="text-sm text-muted-foreground">
          Xem xét và phê duyệt các bất động sản mới được đăng tải bởi người
          dùng.
        </p>
      </div>

      <Card className="overflow-hidden">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex h-40 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : !listings || listings.length === 0 ? (
            <div className="py-16 text-center text-sm text-muted-foreground">
              Tuyệt vời! Hiện tại không có tin nào đang chờ duyệt.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">ID</TableHead>
                  <TableHead>Tiêu đề & Vị trí</TableHead>
                  <TableHead>Mức giá</TableHead>
                  <TableHead>Ngày đăng</TableHead>
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {listings.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">#{item.id}</TableCell>
                    <TableCell>
                      <div className="font-semibold line-clamp-1">
                        {item.title}
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground mt-1">
                        <MapPin className="mr-1 h-3 w-3" />
                        {item.district}, {item.city}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-primary">
                      {formatVnd(item.price)}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(item.createdAt).toLocaleDateString("vi-VN")}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {/* Nút Xem chi tiết (Chuyển hướng sang trang chi tiết) */}
                        <Button
                          variant="outline"
                          size="icon"
                          title="Xem chi tiết"
                          asChild
                        >
                          <Link to={`/property/${item.id}`} target="_blank">
                            <ExternalLink className="h-4 w-4 text-blue-600" />
                          </Link>
                        </Button>

                        {/* Nút Phê duyệt */}
                        <Button
                          variant="outline"
                          size="icon"
                          className="bg-green-50 hover:bg-green-100 hover:text-green-700"
                          title="Phê duyệt"
                          disabled={
                            approveMutation.isPending ||
                            rejectMutation.isPending
                          }
                          onClick={() => approveMutation.mutate(item.id)}
                        >
                          <Check className="h-4 w-4 text-green-600" />
                        </Button>

                        {/* Nút Từ chối */}
                        <Button
                          variant="outline"
                          size="icon"
                          className="bg-red-50 hover:bg-red-100 hover:text-red-700"
                          title="Từ chối"
                          disabled={
                            approveMutation.isPending ||
                            rejectMutation.isPending
                          }
                          onClick={() => rejectMutation.mutate(item.id)}
                        >
                          <X className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
