"use client";

import { useEffect, useState, use } from "react";
import { motion } from "motion/react";
import { 
  ShieldAlert, 
  ArrowLeft, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  Camera,
  X
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { Label } from "@/src/components/ui/label";
import { createDispute } from "@/src/services/disputes";
import { getAssignmentById } from "@/src/services/assignments";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast, Toaster } from "sonner";

export default function RunnerDisputePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const assignmentId = resolvedParams.id;
  const router = useRouter();
  
  const [assignment, setAssignment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [reason, setReason] = useState("");
  const [evidence, setEvidence] = useState<string[]>([""]);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await getAssignmentById(assignmentId);
        if (res?.success) {
          setAssignment(res.data);
        } else {
          toast.error("Failed to load task details.");
        }
      } catch (error) {
        toast.error("An error occurred.");
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [assignmentId]);

  const addEvidenceField = () => setEvidence([...evidence, ""]);
  const removeEvidenceField = (index: number) => {
    const newEvidence = [...evidence];
    newEvidence.splice(index, 1);
    setEvidence(newEvidence);
  };
  const handleUrlChange = (index: number, value: string) => {
    const newEvidence = [...evidence];
    newEvidence[index] = value;
    setEvidence(newEvidence);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      toast.error("Please provide a reason for the dispute.");
      return;
    }
    
    setSubmitting(true);
    const filteredEvidence = evidence.filter(url => url.trim() !== "");
    
    try {
      const res = await createDispute({
        taskId: assignment.taskId,
        reason,
        evidence: filteredEvidence
      });
      
      if (res?.success) {
        toast.success("Dispute raised successfully. Admin will review it.");
        setTimeout(() => {
          router.push(`/dashboard/runner/jobs/${assignmentId}`);
        }, 2000);
      } else {
        toast.error(res?.message || "Failed to raise dispute.");
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="text-center py-20">
        <AlertCircle className="w-16 h-16 mx-auto text-red-500 mb-4" />
        <h2 className="text-2xl font-bold mb-4">Assignment Not Found</h2>
        <Link href="/dashboard/runner/jobs">
          <Button variant="outline">Back to Jobs</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-20">
      <Toaster position="top-right" richColors />
      
      <Link href={`/dashboard/runner/jobs/${assignmentId}`} className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-bold group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Job Details
      </Link>

      <div className="space-y-2">
        <h1 className="text-4xl font-black text-black dark:text-white flex items-center gap-3">
          <ShieldAlert className="w-8 h-8 text-red-500" />
          Raise a Dispute
        </h1>
        <p className="text-muted-foreground text-lg">If there's an issue with payment or task requirements, let us know.</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-8 rounded-[2.5rem] bg-white dark:bg-white/5 border border-red-500/10 shadow-2xl space-y-8"
      >
        <div className="p-6 rounded-3xl bg-red-500/5 border border-red-500/10">
          <p className="text-xs font-black text-red-500 uppercase tracking-widest mb-1">Disputing Task</p>
          <h2 className="text-2xl font-bold text-black dark:text-white">{assignment.task.title}</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-4">
            <Label className="text-sm font-black text-gray-400 uppercase tracking-widest ml-1">
              Reason for Dispute
            </Label>
            <div className="relative">
              <FileText className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
              <Textarea 
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Explain the issue in detail..."
                className="min-h-[150px] pl-12 rounded-2xl bg-gray-50 dark:bg-white/5 border-none font-semibold text-black dark:text-white"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-black text-gray-400 uppercase tracking-widest ml-1">
                Evidence (Image URLs)
              </Label>
              <Button type="button" variant="ghost" onClick={addEvidenceField} className="text-primary font-bold hover:bg-primary/5 rounded-xl">
                + Add More
              </Button>
            </div>
            
            <div className="space-y-3">
              {evidence.map((url, index) => (
                <div key={index} className="flex gap-2">
                  <div className="relative flex-1">
                    <Camera className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                    <Input 
                      value={url}
                      onChange={(e) => handleUrlChange(index, e.target.value)}
                      placeholder="https://..."
                      className="h-12 pl-12 rounded-xl bg-gray-50 dark:bg-white/5 border-none font-semibold"
                    />
                  </div>
                  {evidence.length > 1 && (
                    <Button type="button" variant="ghost" onClick={() => removeEvidenceField(index)} className="h-12 w-12 text-red-500 hover:bg-red-50 rounded-xl p-0">
                      <X className="w-5 h-5" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 dark:border-white/5">
            <Button 
              type="submit" 
              disabled={submitting}
              className="w-full h-16 rounded-2xl bg-red-500 hover:bg-red-600 text-white font-black text-xl shadow-xl shadow-red-500/20 transition-all flex gap-3"
            >
              {submitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <ShieldAlert className="w-6 h-6" />}
              {submitting ? "Submitting..." : "Submit Dispute"}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
