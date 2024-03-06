function bytesToMb(bytes) {
  if (typeof bytes !== "number" || isNaN(bytes) || bytes < 0) {
    throw new Error("El valor debe ser un número positivo.");
  }

  const megabytes = bytes / (1024 * 1024);
  return megabytes.toFixed(2); 
}

module.exports = bytesToMb; 