

export function getSizeImage(number) {
  if (number < 1024) {
    return `${number} bytes`;
  } else if (number >= 1024 && number < 1048576) {
    return `${(number / 1024).toFixed(1)} KB`;
  } else if (number >= 1048576) {
    return `${(number / 1048576).toFixed(1)} MB`;
  }
}

export function bytesToMb(bytes) {
  if (typeof bytes !== "number" || isNaN(bytes) || bytes < 0) {
    throw new Error("El valor debe ser un número positivo.");
  }

  const megabytes = bytes / (1024 * 1024);
  return megabytes.toFixed(2); // Redondear a 2 decimales
}

