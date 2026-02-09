import type { jsPDF } from 'jspdf';

/**
 * Add a full-width image to a jsPDF document, splitting across multiple pages
 * when the content is taller than one page. Prevents content from being cut off.
 */
export function addImageToPdfMultiPage(
  pdf: jsPDF,
  imgData: string,
  canvasWidth: number,
  canvasHeight: number
): void {
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();
  const scaledH = (canvasHeight * pageW) / canvasWidth;

  if (scaledH <= pageH) {
    pdf.addImage(imgData, 'PNG', 0, 0, pageW, scaledH);
    return;
  }

  let position = 0;
  pdf.addImage(imgData, 'PNG', 0, position, pageW, scaledH);
  let heightLeft = scaledH - pageH;

  while (heightLeft > 0) {
    pdf.addPage();
    position -= pageH;
    pdf.addImage(imgData, 'PNG', 0, position, pageW, scaledH);
    heightLeft -= pageH;
  }
}
