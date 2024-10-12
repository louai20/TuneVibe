import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";

const uploadFileToFileIo = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("https://file.io", {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  // Check if the response contains a link
  if (data.success) {
    return data.link; // Assuming the response has a 'link' property
  } else {
    throw new Error("File upload failed: " + data.error);
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
    // Capture the first element as an image
    const firstCanvas = await html2canvas(firstElement, {
      backgroundColor: null, // Retain background styles
      scale: 2, // Increase scale for better resolution
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
      // Convert the PDF to a Blob for uploading
      const pdfOutput = pdf.output("blob"); // Get the PDF as a Blob

      // Convert Blob to File
      const file = new File([pdfOutput], filename, { type: "application/pdf" });
      // Upload the PDF to file.io and share the link
      const shareableLink = await uploadFileToFileIo(file); // Update this to use the File object

      // Share the link on Twitter
      const twitterShareUrl = `https://x.com/intent/tweet?url=${encodeURIComponent(
        shareableLink
      )}&text=Check%20out%20my%20analysis!`;
      window.open(twitterShareUrl, "_blank");
    }
  } catch (error) {
    console.error("Error generating PDF:", error);
  }
};
