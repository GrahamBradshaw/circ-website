// This file is part of the CIRC website.
// It belongs to the library layer and contains the logic for this feature.
// Read it from top to bottom to understand how the page, component, or data flow works.
import ImageKit, { toFile } from "@imagekit/nodejs"

let imagekitInstance: InstanceType<typeof ImageKit> | null = null

function getImageKit() {
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY?.trim()

  if (!privateKey) {
    throw new Error("ImageKit is not configured. Set IMAGEKIT_PRIVATE_KEY.")
  }

  if (!imagekitInstance) {
    imagekitInstance = new ImageKit({ privateKey })
  }

  return imagekitInstance
}

// This function uploadToImageKit handles the main work in this file and explains what this logic is doing in simple English.
export async function uploadToImageKit(
  file: Buffer,
  fileName: string,
  folder: string = "/circ"
): Promise<string> {
  const ik = getImageKit()
  const uploadableFile = await toFile(file, fileName)

  const result = await ik.files.upload({
    file: uploadableFile,
    fileName,
    folder,
    useUniqueFileName: true,
  })

  return result.url ?? ""
}
