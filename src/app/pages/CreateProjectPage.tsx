import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Upload, FileText, ArrowLeft, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const MAX_IMAGES = 10;

function isPdf(file: File) {
  return file.type === 'application/pdf';
}
function isImage(file: File) {
  return file.type.startsWith('image/');
}

export function CreateProjectPage() {
  const [name, setName] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const navigate = useNavigate();

  const hasPdf = files.some(isPdf);
  const imagesCount = files.filter(isImage).length;
  const canAddMore = !hasPdf && imagesCount < MAX_IMAGES;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (canAddMore) setIsDragging(true);
  };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (!canAddMore) return;
    const list = Array.from(e.dataTransfer.files).filter((f) => isPdf(f) || isImage(f));
    setFiles((prev) => {
      if (prev.some(isPdf)) return prev;
      const hasNewPdf = list.some(isPdf);
      if (hasNewPdf) {
        const pdf = list.find(isPdf)!;
        return [pdf];
      }
      const currentImages = prev.filter(isImage).length;
      const toAdd = list.filter(isImage).slice(0, MAX_IMAGES - currentImages);
      return [...prev, ...toAdd];
    });
  };
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!canAddMore) return;
    const list = Array.from(e.target.files ?? []);
    setFiles((prev) => {
      if (prev.some(isPdf)) return prev;
      const hasNewPdf = list.some(isPdf);
      if (hasNewPdf) {
        const pdf = list.find(isPdf)!;
        return [pdf];
      }
      const currentImages = prev.filter(isImage).length;
      const toAdd = list.filter(isImage).slice(0, MAX_IMAGES - currentImages);
      return [...prev, ...toAdd];
    });
    e.target.value = '';
  };
  const removeFile = (i: number) => setFiles((prev) => prev.filter((_, idx) => idx !== i));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    // Mock: создаём проект и редирект на дашборд (в реальности — на проект с status processing)
    navigate('/app');
  };

  return (
    <div className="flex min-h-[85vh] flex-col">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="text-white hover:bg-white/10">
            <Link to="/app">
              <ArrowLeft size={20} />
            </Link>
          </Button>
          <div>
            <h1 className="font-heading text-2xl text-white lg:text-3xl">Создать проект</h1>
            <p className="mt-1 font-body text-sm text-white/70">Название и загрузка материалов</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button type="submit" form="create-project-form" className="rounded-xl bg-lime px-6 text-violet hover:bg-lime-dark" disabled={!name.trim() || files.length === 0}>
            Создать и загрузить
          </Button>
          <Button type="button" variant="outline" asChild className="rounded-xl border-white/20 text-white hover:bg-white/10">
            <Link to="/app">Отмена</Link>
          </Button>
        </div>
      </div>

      <form id="create-project-form" onSubmit={handleSubmit} className="mt-8 flex flex-1 flex-col justify-center space-y-6">
        <div className="mx-auto w-full max-w-4xl min-h-[520px] rounded-[28px] border border-white/10 bg-surface px-8 py-12">
          <div>
            <label className="mb-2 block font-label text-xs uppercase tracking-wider text-violet/80">Название проекта</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-12 rounded-xl border-violet/15 bg-violet/5 text-violet"
              required
            />
          </div>
          <div className="mt-5">
            <label className="mb-2 block font-label text-xs uppercase tracking-wider text-violet/80">Файлы (PDF, изображения)</label>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`rounded-xl border-2 border-dashed p-14 text-center transition-colors ${
                !canAddMore ? 'cursor-not-allowed border-violet/10 bg-violet/5 opacity-75' : isDragging ? 'border-lime bg-lime/10' : 'border-violet/20 bg-violet/5'
              }`}
            >
              <Upload size={40} className="mx-auto text-lime/80" />
              <p className="mt-2 font-body text-violet">
                {hasPdf
                  ? 'Добавлен PDF, дополнительные файлы добавить нельзя'
                  : imagesCount >= MAX_IMAGES
                    ? `Максимум ${MAX_IMAGES} изображений`
                    : 'Перетащите файлы сюда или выберите'}
              </p>
              <input
                type="file"
                accept=".pdf,image/*"
                multiple
                onChange={handleFileInput}
                disabled={!canAddMore}
                className="mt-3 hidden"
                id="file-upload"
              />
              {canAddMore && (
                <label htmlFor="file-upload" className="inline-block">
                  <span className="mt-3 inline-flex cursor-pointer items-center justify-center rounded-xl border-2 border-violet/40 bg-surface px-4 py-2 font-body text-sm font-medium text-violet hover:bg-violet/10">
                    Выбрать файлы
                  </span>
                </label>
              )}
            </div>
            {files.length > 0 && (
              <ul className="mt-4 space-y-2">
                {files.map((f, i) => (
                  <li key={i} className="flex items-center justify-between rounded-lg bg-violet/5 px-3 py-2">
                    <span className="flex items-center gap-2 font-body text-sm text-violet">
                      <FileText size={16} />
                      {f.name}
                    </span>
                    <Button type="button" variant="ghost" size="sm" className="text-violet/70 hover:text-violet" onClick={() => removeFile(i)}>
                      Удалить
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="mx-auto max-w-2xl rounded-[28px] border border-violet/20 bg-violet/5 p-6">
          <div className="flex items-center gap-2 font-label text-xs uppercase tracking-wider text-violet/80">
            <Info size={16} />
            Ограничения на загрузку
          </div>
          <ul className="mt-3 space-y-1.5 font-body text-sm text-violet/90">
            <li>• Максимум 50 страниц PDF на один проект</li>
            <li>• Максимум {MAX_IMAGES} изображений на один проект</li>
            <li>• Максимальный размер одного файла — 20 MB</li>
            <li>• Общий объём текста после обработки не более 150 000 символов</li>
          </ul>
          <p className="mt-4 font-body text-sm text-violet/80">
            Для обеспечения стабильной работы системы существуют ограничения на объём загружаемых материалов. Если материал превышает лимит, рекомендуется разделить его на несколько проектов.
          </p>
        </div>

      </form>
    </div>
  );
}
