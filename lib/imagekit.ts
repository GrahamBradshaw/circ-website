// This file is part of the CIRC website.
// It belongs to the library layer and contains the logic for this feature.
// Read it from top to bottom to understand how the page, component, or data flow works.
import ImageKit from "imagekit"

let imagekitInstance: InstanceType<typeof ImageKit> | null = null

function getImageKit() {
  const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY?.trim()
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY?.trim()
  const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT?.trim()

  if (!publicKey || !privateKey || !urlEndpoint) {
    throw new Error(
      "ImageKit is not configured. Set NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, and NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT."
    )
  }

  if (!imagekitInstance) {
    imagekitInstance = new ImageKit({ publicKey, privateKey, urlEndpoint })
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
  
  const result = await ik.upload({
    file: file,
    fileName: fileName,
    folder: folder,
    useUniqueFileName: true,
  })
  
  return result.url
}
