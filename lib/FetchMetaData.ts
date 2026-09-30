import { MetaDataResponseDataType } from "@/app/layout";
import { APP_URL, CurrentProjectId } from "./ProjectId";

export async function fetchMetaData() {
  const res = await fetch(
    `${APP_URL}/api/project/${CurrentProjectId}/metadata`,
    {
      next: {
        tags: ["metadata"],
      },
    },
  );
  const data: MetaDataResponseDataType = await res.json();
  return data;
}
