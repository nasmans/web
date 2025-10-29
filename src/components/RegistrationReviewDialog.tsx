import React from "react";

export interface RegistrationData {
  fullName: string;
  email: string;
  phone: string;
  wilaya: string;
  city: string;
  address: string;
  notes?: string;
  guests: number;
}

interface RegistrationReviewDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  data: RegistrationData;
  agreementChecked: boolean;
  onAgreementChange: (checked: boolean) => void;
}

export const RegistrationReviewDialog: React.FC<RegistrationReviewDialogProps> = ({
  open,
  onClose,
  onConfirm,
  data,
  agreementChecked,
  onAgreementChange,
}) => {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl">
        <header className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">مراجعة معلومات التسجيل</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
            aria-label="إغلاق"
          >
            ×
          </button>
        </header>

        <div className="space-y-2 text-gray-700">
          <InfoRow label="الاسم الكامل" value={data.fullName} />
          <InfoRow label="البريد الإلكتروني" value={data.email} />
          <InfoRow label="رقم الهاتف" value={data.phone} />
          <InfoRow label="الولاية" value={data.wilaya} />
          <InfoRow label="البلدية / المدينة" value={data.city} />
          <InfoRow label="العنوان" value={data.address} />
          <InfoRow label="عدد الضيوف" value={String(data.guests)} />
          {data.notes ? <InfoRow label="ملاحظات إضافية" value={data.notes} /> : null}
        </div>

        <label className="mt-6 flex items-start space-x-3 space-x-reverse text-sm text-gray-600">
          <input
            type="checkbox"
            className="mt-1 h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            checked={agreementChecked}
            onChange={(event) => onAgreementChange(event.target.checked)}
          />
          <span>
            أؤكد أن جميع المعلومات صحيحة وأوافق على شروط الحجز وسياسة الخصوصية.
          </span>
        </label>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-full border border-gray-300 px-5 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 sm:w-auto"
          >
            تعديل المعلومات
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={!agreementChecked}
            className="w-full rounded-full bg-indigo-600 px-6 py-2 text-sm font-semibold text-white transition enabled:hover:bg-indigo-500 enabled:focus:outline-none enabled:focus:ring-2 enabled:focus:ring-indigo-400 disabled:cursor-not-allowed disabled:bg-indigo-300 sm:w-auto"
          >
            أكمل عملية التسجيل
          </button>
        </div>
      </div>
    </div>
  );
};

interface InfoRowProps {
  label: string;
  value: string;
}

const InfoRow: React.FC<InfoRowProps> = ({ label, value }) => (
  <p className="flex flex-col rounded-lg bg-gray-50 px-4 py-2 text-sm sm:flex-row sm:items-center sm:justify-between">
    <span className="font-semibold text-gray-900">{label}</span>
    <span className="mt-1 text-gray-700 sm:mt-0">{value}</span>
  </p>
);

export default RegistrationReviewDialog;
