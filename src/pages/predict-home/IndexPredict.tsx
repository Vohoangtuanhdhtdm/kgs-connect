import { useState } from "react";
import { Building2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ValuationForm } from "@/components/predict/ValuationForm";
import { ResultCard } from "@/components/predict/ResultCard";

export interface ValuationResult {
  predicted_price_billion_vnd: number;
  safe_price_min: number;
  safe_price_max: number;
  applied_neighborhood_index: number;
}

export interface FormData {
  addressDetail: string;
  city: string;
  district: string;
  ward: string;
  area: number;
  frontage: number;
  accessRoad: number;
  floors: number;
  bedrooms: number;
  bathrooms: number;
  houseDirection: string;
  legalStatus: string;
  furnitureState: string;
  propertyType: string;
}

const IndexPredict = () => {
  const [result, setResult] = useState<ValuationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (data: FormData) => {
    setLoading(true);
    setResult(null);
    try {
      const token = localStorage.getItem("kgs_token");
      const res = await fetch("https://localhost:7129/api/Valuation/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        if (res.status === 401)
          throw new Error("Vui lòng đăng nhập để định giá!");
        throw new Error("Server error");
      }

      const json = await res.json();
      if (json.status === "success") {
        setResult(json.data);
      } else {
        throw new Error("Unexpected response");
      }
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: err.message || "Có lỗi xảy ra khi kết nối đến server",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Building2 className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">
              PropTech Valuation
            </h1>
            <p className="text-xs text-muted-foreground">
              Định giá bất động sản thông minh
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl p-6">
        <div className="grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <ValuationForm onSubmit={handleSubmit} loading={loading} />
          </div>
          <div className="lg:col-span-2">
            <ResultCard result={result} loading={loading} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default IndexPredict;
