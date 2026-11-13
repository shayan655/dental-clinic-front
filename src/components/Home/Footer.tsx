import FooterView from "./FooterView";
import { getClinicInfo } from "@/lib/clinic";

export default async function Footer() {
  return <FooterView clinic={await getClinicInfo()} />;
}