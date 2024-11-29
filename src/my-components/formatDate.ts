export const formatDate = (isoString: string | number | Date): string => {
    const date = new Date(isoString);

    const options: Intl.DateTimeFormatOptions = {
      weekday: "long", // Zobrazí den v týdnu (např. "Saturday")
      year: "numeric", // Zobrazí rok (např. "2024")
      month: "long", // Zobrazí měsíc v textové podobě (např. "November")
      day: "numeric", // Zobrazí den v měsíci (např. "23")
      hour: "2-digit", // Zobrazí hodinu ve formátu 2 číslic (např. "13")
      minute: "2-digit", // Zobrazí minuty ve formátu 2 číslic (např. "54")
      timeZoneName: "short", // Zobrazí zkratku časového pásma (např. "UTC")
      timeZone: "Europe/Prague", // Nastaví časové pásmo na CET
    };

    return new Intl.DateTimeFormat("en-GB", options).format(date);
  };