import { Loading } from "@/components/Loading";
import { TimerIcon } from "lucide-react";

export default function LoadingPage() {
  return <Loading message="Loading..." badge={TimerIcon} />;
}
