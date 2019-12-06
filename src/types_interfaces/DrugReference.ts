interface IDrugReference {
  drugName: string;
  referenceCount: number;
  isStreetName: boolean;
  drugTypes?: string[];
}

export default IDrugReference;
