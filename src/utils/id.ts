const GENDER_SEGMENT: Record<'M' | 'F', string> = {
  M: '01',
  F: '02'
};

/**
 * يولّد معرّف عميل مطابق للنمط CIDYYMMGG#### حيث:
 * - YY تمثل آخر رقمين من السنة الحالية.
 * - MM تمثل الشهر الحالي مكون من خانتين.
 * - GG تمثل رمز الجنس (01 للذكور، 02 للإناث).
 * - #### سلسلة عشوائية من أربعة أرقام لضمان التفرد.
 */
export function generateClientId(gender: 'M' | 'F'): string {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const genderCode = GENDER_SEGMENT[gender];
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, '0');

  return `CID${year}${month}${genderCode}${random}`;
}
