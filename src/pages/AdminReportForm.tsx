import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Search, Package, Loader2 } from "lucide-react";

interface Report {
  report_id: string;
  client_name: string;
  batch_lot: string;
  sample_received_date: string | null;
  analysis_completed_date: string | null;
  product_name: string;
  expected_quantity: number | null;
  purity_result: number | null;
  identity_result: string | null;
  quantity_result: number | null;
  retention_time: number | null;
  peak_area: number | null;
  peak_height: number | null;
  user_email: string;
}

const AdminReportForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingReports, setLoadingReports] = useState(false);
  const [pendingReports, setPendingReports] = useState<Report[]>([]);
  const [selectedReportId, setSelectedReportId] = useState("");
  const [formData, setFormData] = useState({
    report_id: "",
    client_name: "",
    batch_lot: "",
    sample_received_date: "",
    analysis_completed_date: "",
    product_name: "",
    expected_quantity: "",
    purity_result: "",
    identity_result: "",
    quantity_result: "",
    retention_time: "",
    peak_area: "",
    peak_height: "",
    user_email: ""
  });

  useEffect(() => {
    loadPendingReports();
  }, []);

  const loadPendingReports = async () => {
    setLoadingReports(true);
    try {
      const { data, error } = await supabase
        .from("reports")
        .select("*")
        .is("retention_time", null)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPendingReports(data || []);
    } catch (error: any) {
      console.error("Error loading reports:", error);
      toast.error("Error loading pending reports");
    } finally {
      setLoadingReports(false);
    }
  };

  const handleSelectReport = (reportId: string) => {
    setSelectedReportId(reportId);
    const report = pendingReports.find(r => r.report_id === reportId);
    if (report) {
      setFormData({
        report_id: report.report_id || "",
        client_name: report.client_name || "",
        batch_lot: report.batch_lot || "",
        sample_received_date: report.sample_received_date || "",
        analysis_completed_date: report.analysis_completed_date || "",
        product_name: report.product_name || "",
        expected_quantity: report.expected_quantity?.toString() || "",
        purity_result: "",
        identity_result: "",
        quantity_result: "",
        retention_time: "",
        peak_area: "",
        peak_height: "",
        user_email: report.user_email || ""
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const updateData = {
        client_name: formData.client_name,
        batch_lot: formData.batch_lot,
        sample_received_date: formData.sample_received_date || null,
        analysis_completed_date: formData.analysis_completed_date || null,
        product_name: formData.product_name,
        expected_quantity: formData.expected_quantity ? parseFloat(formData.expected_quantity) : null,
        purity_result: formData.purity_result ? parseFloat(formData.purity_result) : null,
        identity_result: formData.identity_result || null,
        quantity_result: formData.quantity_result ? parseFloat(formData.quantity_result) : null,
        retention_time: formData.retention_time ? parseFloat(formData.retention_time) : null,
        peak_area: formData.peak_area ? parseFloat(formData.peak_area) : null,
        peak_height: formData.peak_height ? parseFloat(formData.peak_height) : null,
        user_email: formData.user_email,
      };

      const { error } = await supabase
        .from("reports")
        .update(updateData)
        .eq("report_id", formData.report_id);

      if (error) throw error;

      toast.success("Report updated successfully!");
      
      setFormData({
        report_id: "",
        client_name: "",
        batch_lot: "",
        sample_received_date: "",
        analysis_completed_date: "",
        product_name: "",
        expected_quantity: "",
        purity_result: "",
        identity_result: "",
        quantity_result: "",
        retention_time: "",
        peak_area: "",
        peak_height: "",
        user_email: ""
      });
      setSelectedReportId("");
      loadPendingReports();

    } catch (error: any) {
      console.error("Error updating data:", error);
      toast.error("Error saving report: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 pt-24 pb-12">
        <div className="container max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle>Update Report / Enter Lab Results</CardTitle>
              <CardDescription>
                Select a pending report and enter the test results to complete the analysis.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <Label className="mb-2 block">Select Pending Report</Label>
                {loadingReports ? (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading pending reports...
                  </div>
                ) : pendingReports.length === 0 ? (
                  <div className="text-muted-foreground p-4 border rounded-lg bg-secondary/30">
                    No pending reports found. All reports have been processed.
                  </div>
                ) : (
                  <Select value={selectedReportId} onValueChange={handleSelectReport}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a pending report to update" />
                    </SelectTrigger>
                    <SelectContent>
                      {pendingReports.map((report) => (
                        <SelectItem key={report.report_id} value={report.report_id}>
                          <div className="flex items-center gap-2">
                            <Package className="h-4 w-4" />
                            <span className="font-mono text-xs">{report.report_id}</span>
                            <span className="text-muted-foreground">- {report.product_name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              {selectedReportId && (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium border-b pb-2">Basic Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="report_id">Report ID (Code)</Label>
                        <Input id="report_id" name="report_id" value={formData.report_id} disabled className="bg-muted" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="user_email">Client Email</Label>
                        <Input id="user_email" name="user_email" value={formData.user_email} disabled className="bg-muted" />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="product_name">Product</Label>
                        <Input id="product_name" name="product_name" value={formData.product_name} onChange={handleChange} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="expected_quantity">Expected Qtd.</Label>
                        <Input id="expected_quantity" name="expected_quantity" value={formData.expected_quantity} onChange={handleChange} />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="client_name">Client Name</Label>
                        <Input id="client_name" name="client_name" value={formData.client_name} onChange={handleChange} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="batch_lot">Batch / Lot</Label>
                        <Input id="batch_lot" name="batch_lot" value={formData.batch_lot} onChange={handleChange} />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="sample_received_date">Sample Received Date</Label>
                        <Input id="sample_received_date" name="sample_received_date" type="date" value={formData.sample_received_date} onChange={handleChange} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="analysis_completed_date">Analysis Completed Date</Label>
                        <Input id="analysis_completed_date" name="analysis_completed_date" type="date" value={formData.analysis_completed_date} onChange={handleChange} />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4">
                    <h3 className="text-lg font-medium border-b pb-2">Core Panel Results</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="purity_result">Purity *</Label>
                        <Input id="purity_result" name="purity_result" value={formData.purity_result} onChange={handleChange} placeholder="ex: 99.77%" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="identity_result">Identity *</Label>
                        <Input id="identity_result" name="identity_result" value={formData.identity_result} onChange={handleChange} placeholder="ex: TB500" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="quantity_result">Quantity *</Label>
                        <Input id="quantity_result" name="quantity_result" value={formData.quantity_result} onChange={handleChange} placeholder="ex: 10.08 mg" required />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4">
                    <h3 className="text-lg font-medium border-b pb-2">Chromatogram Data (HPLC)</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="retention_time">Retention Time (min)</Label>
                        <Input id="retention_time" name="retention_time" type="number" step="0.001" value={formData.retention_time} onChange={handleChange} placeholder="ex: 5.528" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="peak_area">Peak Area (%)</Label>
                        <Input id="peak_area" name="peak_area" type="number" step="0.1" value={formData.peak_area} onChange={handleChange} placeholder="ex: 99.2" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="peak_height">Peak Height (mAU)</Label>
                        <Input id="peak_height" name="peak_height" type="number" step="1" value={formData.peak_height} onChange={handleChange} placeholder="ex: 800" />
                      </div>
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Saving..." : "Update Report"}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminReportForm;