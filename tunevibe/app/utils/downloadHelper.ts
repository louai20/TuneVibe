import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import { toast } from "react-hot-toast";

const uploadImageToImgur = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("image", file);

  // Send the file to your Next.js API route
  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (response.ok) {
    return data.link; // Return the link to the uploaded image
  } else {
    throw new Error("Image upload failed: " + data.error);
  }
};

export const handleDownloadAndShare = async (
  firstElementId: string,
  secondElementId: string,
  title: string, // Add a title parameter
  action: "download" | "share",
  filename: string = "playlist_analysis.pdf"
) => {
  const firstElement = document.getElementById(firstElementId);
  const secondElement = document.getElementById(secondElementId);

  if (!firstElement || !secondElement) {
    console.error("One or both elements not found!");
    return;
  }

  try {
    // Show loading toast
    const loadingToastId = toast.loading("Generating your document...");

    // Capture the first element as an image
    const firstCanvas = await html2canvas(firstElement, {
      backgroundColor: null, // Retain background styles
      scale: 2, // Increase scale for better resolution
      useCORS: true, // Enable CORS if you're loading external images
      imageTimeout: 2000, // Allow images to load
    });

    // Create a new PDF document
    const pdf = new jsPDF();

    // Set up image dimensions
    const imgData = firstCanvas.toDataURL("image/png");
    const imgWidth = pdf.internal.pageSize.getWidth();
    const imgHeight = (firstCanvas.height * imgWidth) / firstCanvas.width;

    // Add title above the image
    pdf.setFontSize(20); // Set title font size
    pdf.text(title, 10, 20); // Add title with margin from top

    // Add the image to the PDF (centered)
    const xPosition = (imgWidth - imgWidth) / 2; // Centering the image horizontally
    pdf.addImage(imgData, "PNG", xPosition, 30, imgWidth, imgHeight); // Adjust y position to be below the title

    // Add a line break
    const textStartY = 30 + imgHeight + 10; // Calculate the starting Y position for the text
    pdf.setFontSize(16); // Set the font size for the text
    pdf.setFont("Helvetica", "normal"); // Set the font style for the text

    // Get the text content from the second element
    const secondText = secondElement.innerText; // or use .textContent
    const textLines = pdf.splitTextToSize(secondText, imgWidth - 20); // Split text into multiple lines
    pdf.text(textLines, 10, textStartY); // Add the text below the image

    if (action === "download") {
      // Save the PDF
      pdf.save(filename);
    } else if (action === "share") {
      // Upload the chart image to Imgur
      const chartImageFile = new File(
        [await fetch(imgData).then((res) => res.blob())],
        "chart.png",
        { type: "image/png" }
      );
      const shareableLink = await uploadImageToImgur(chartImageFile); // Upload the image to Imgur

      // Share the link on Twitter
      const twitterShareUrl = `https://x.com/intent/tweet?url=${encodeURIComponent(
        shareableLink
      )}&text=Check%20out%20my%20analysis!`;
      window.open(twitterShareUrl, "_blank");
    }

    // Show success toast
    toast.success("Document generated successfully!");

    // Close the loading toast
    toast.dismiss(loadingToastId);
  } catch (error) {
    console.error("Error generating PDF:", error);
    toast.error("Error generating document.");
  }
};
