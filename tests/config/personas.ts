// List of synthetic Greek personas available on the onboarding page.
// Each entry contains the value used in the select element and a human‑readable label.

export interface Persona {
  code: string;
  label: string;
}

export const personas: Persona[] = [
  { code: 'GR-MARIA-22-ATH', label: 'Μαρία, 22, Αθήνα' },
  { code: 'GR-GIANNIS-24-THESS', label: 'Γιάννης, 24, Θεσσαλονίκη' },
  { code: 'GR-ELENI-27-PATRAS', label: 'Ελένη, 27, Πάτρα' },
  { code: 'GR-NIKOS-29-HER', label: 'Νίκος, 29, Ηράκλειο' },
  { code: 'GR-ANNA-31-ATH', label: 'Άννα, 31, Αθήνα' },
  { code: 'GR-KOSTAS-33-LAR', label: 'Κώστας, 33, Λάρισα' },
  { code: 'GR-DIMITRA-35-VOL', label: 'Δήμητρα, 35, Βόλος' },
  { code: 'GR-PANAGIOTIS-36-THESS', label: 'Παναγιώτης, 36, Θεσσαλονίκη' },
  { code: 'GR-CHRISTINA-38-IOA', label: 'Χριστίνα, 38, Ιωάννινα' },
  { code: 'GR-STELIOS-39-PIR', label: 'Στέλιος, 39, Πειραιάς' },
  { code: 'GR-IOANNA-41-ATH', label: 'Ιωάννα, 41, Αθήνα' },
  { code: 'GR-MANOLIS-42-HER', label: 'Μανώλης, 42, Ηράκλειο' },
  { code: 'GR-SOFIA-44-PATRAS', label: 'Σοφία, 44, Πάτρα' },
  { code: 'GR-VASILIS-45-LAR', label: 'Βασίλης, 45, Λάρισα' },
  { code: 'GR-KATERINA-47-THESS', label: 'Κατερίνα, 47, Θεσσαλονίκη' },
  { code: 'GR-DIMITRIS-49-ATH', label: 'Δημήτρης, 49, Αθήνα' },
  { code: 'GR-LINA-52-VOL', label: 'Λίνα, 52, Βόλος' },
  { code: 'GR-GIORGOS-54-KAL', label: 'Γιώργος, 54, Καλαμάτα' },
  { code: 'GR-EIRINI-57-LAR', label: 'Ειρήνη, 57, Λάρισα' },
  { code: 'GR-ANTONIS-60-THESS', label: 'Αντώνης, 60, Θεσσαλονίκη' },
];