import { useCallback, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowRight, Loader2, PlusCircle, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { apiGetProject } from '@/api/projects';
import type { ProjectDto } from '@/api/projects';
import { apiGetProjectLectures, apiCreateLecture } from '@/api/lectures';
import type { LectureDto } from '@/api/lectures';

const MAX_IMAGES = 10;

function isPdf(file: File) {
  return file.type === 'application/pdf';
}
function isImage(file: File) {
  return file.type.startsWith('image/');
}

export function ProjectPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<ProjectDto | null>(null);
  const [lectures, setLectures] = useState<LectureDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [addLectureOpen, setAddLectureOpen] = useState(false);
  const [lectureTitle, setLectureTitle] = useState('');
  const [lectureFiles, setLectureFiles] = useState<File[]>([]);
  const [lectureError, setLectureError] = useState<string | null>(null);
  const [lectureSubmitting, setLectureSubmitting] = useState(false);

  const fetchProject = useCallback(() => {
    if (!projectId) return Promise.reject();
    return apiGetProject(projectId).then(setProject);
  }, [projectId]);

  const fetchLectures = useCallback(() => {
    if (!projectId) return Promise.reject();
    return apiGetProjectLectures(projectId).then((list) => setLectures(Array.isArray(list) ? list : []));
  }, [projectId]);

  useEffect(() => {
    if (!projectId) {
      setLoading(false);
      setNotFound(true);
      return;
    }
    setNotFound(false);
    fetchProject()
      .then(() => {
        fetchLectures().catch(() => setLectures([]));
      })
      .catch(() => {
        setProject(null);
        setLectures([]);
        setNotFound(true);
      })
      .finally(() => setLoading(false));
  }, [projectId, fetchProject, fetchLectures]);

  const hasPdf = lectureFiles.some(isPdf);
  const imagesCount = lectureFiles.filter(isImage).length;
  const canAddMoreFiles = !hasPdf && imagesCount < MAX_IMAGES;
  const isValidFiles = hasPdf ? lectureFiles.length === 1 : lectureFiles.length >= 1 && lectureFiles.length <= MAX_IMAGES && lectureFiles.every(isImage);

  const handleAddLectureFiles = (list: File[]) => {
    const pdfs = list.filter(isPdf);
    const imgs = list.filter(isImage);
    if (pdfs.length > 0) {
      setLectureFiles([pdfs[0]]);
      setLectureError(null);
      return;
    }
    if (imgs.length > 0) {
      setLectureFiles((prev) => {
        const current = prev.filter(isImage).length;
        const toAdd = imgs.slice(0, MAX_IMAGES - current);
        return [...prev.filter(isPdf), ...toAdd].slice(0, MAX_IMAGES);
      });
      setLectureError(null);
      return;
    }
  };

  const handleSubmitLecture = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectId || !lectureTitle.trim() || !isValidFiles || lectureFiles.length === 0) return;
    setLectureError(null);
    setLectureSubmitting(true);
    try {
      await apiCreateLecture(projectId, lectureTitle.trim(), lectureFiles);
      setLectureTitle('');
      setLectureFiles([]);
      setAddLectureOpen(false);
      await fetchLectures();
    } catch {
      setLectureError('Не удалось добавить лекцию.');
    } finally {
      setLectureSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 size={48} className="animate-spin text-lime" />
        <p className="mt-4 font-body text-sm text-white/70">Загрузка…</p>
      </div>
    );
  }

  if (notFound || !project) {
    return (
      <div className="rounded-[28px] bg-surface p-8 text-center">
        <p className="font-body text-violet">Проект не найден.</p>
        <Button asChild className="mt-4 rounded-xl bg-lime text-violet">
          <Link to="/app">На главную</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="text-white hover:bg-white/10">
          <Link to="/app">
            <ArrowRight size={20} className="rotate-180" />
          </Link>
        </Button>
        <div>
          <h1 className="font-heading text-2xl text-white lg:text-3xl">{project.name}</h1>
          <p className="mt-1 font-body text-sm text-white/70">Лекции проекта</p>
        </div>
      </div>

      <div className="rounded-[28px] border border-white/10 bg-surface p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-heading text-lg text-violet">Лекции</h2>
          <Button
            type="button"
            className="gap-2 rounded-xl bg-lime text-violet hover:bg-lime-dark"
            onClick={() => setAddLectureOpen((v) => !v)}
          >
            <PlusCircle size={18} />
            Добавить лекцию
          </Button>
        </div>

        {addLectureOpen && (
          <form onSubmit={handleSubmitLecture} className="mt-6 rounded-xl border border-violet/20 bg-violet/5 p-6">
            <label className="mb-2 block font-label text-xs uppercase tracking-wider text-violet/80">Название лекции</label>
            <Input
              value={lectureTitle}
              onChange={(e) => setLectureTitle(e.target.value)}
              className="mb-4 h-12 rounded-xl border-violet/15 bg-surface text-violet"
              required
            />
            <label className="mb-2 block font-label text-xs uppercase tracking-wider text-violet/80">Файлы</label>
            <p className="mb-2 font-body text-sm text-violet/70">Либо 1 PDF (до 10 страниц), либо до 10 изображений.</p>
            <div className="flex flex-wrap items-center gap-3">
              <input
                type="file"
                accept=".pdf,image/*"
                multiple
                onChange={(e) => handleAddLectureFiles(Array.from(e.target.files ?? []))}
                className="hidden"
                id="lecture-files"
              />
              <label htmlFor="lecture-files" className="inline-flex cursor-pointer items-center gap-2 rounded-xl border-2 border-violet/30 bg-surface px-4 py-2 font-body text-sm text-violet hover:bg-violet/10">
                <Upload size={18} />
                Выбрать файлы
              </label>
              {lectureFiles.length > 0 && (
                <span className="font-body text-sm text-violet/70">
                  {lectureFiles.map((f) => f.name).join(', ')}
                  <Button type="button" variant="ghost" size="sm" className="ml-2 text-violet/70" onClick={() => setLectureFiles([])}>
                    Очистить
                  </Button>
                </span>
              )}
            </div>
            {lectureError && <p className="mt-2 font-body text-sm text-red-400">{lectureError}</p>}
            <div className="mt-4 flex gap-2">
              <Button type="submit" className="rounded-xl bg-lime text-violet hover:bg-lime-dark" disabled={!lectureTitle.trim() || !isValidFiles || lectureFiles.length === 0 || lectureSubmitting}>
                {lectureSubmitting ? 'Отправка…' : 'Добавить'}
              </Button>
              <Button type="button" variant="outline" className="rounded-xl border-violet/30 bg-surface text-violet hover:bg-violet/10" onClick={() => setAddLectureOpen(false)}>
                Отмена
              </Button>
            </div>
          </form>
        )}

        {(lectures?.length ?? 0) === 0 && !addLectureOpen ? (
          <p className="mt-6 text-center font-body text-violet/80">У вас не загружено ни одной лекции.</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {(lectures ?? []).map((lec) => (
              <li key={lec.id}>
                <Link
                  to={`/app/projects/${projectId}/lectures/${lec.id}`}
                  className="flex items-center justify-between rounded-xl border border-violet/10 bg-violet/5 px-4 py-3 transition-colors hover:bg-violet/10"
                >
                  <span className="font-body text-violet">{lec.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
