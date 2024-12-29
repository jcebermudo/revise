import { pinata } from "@/utils/config"

export default async function deletePrevPFP(cid: string | null | undefined): Promise<void> {
    if (!cid) {
        return;
    }
        await pinata.files.delete([cid]);

}