import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ArrowRight, Loader2, PlusCircle, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AddLectureProgressModal } from '@/app/components/AddLectureProgressModal';
import { apiGetProject } from '@/api/projects';
import type { ProjectDto } from '@/api/projects';
import { apiGetProjectLectures, apiCreateLecture } from '@/api/lectures';
import type { LectureDto } from '@/api/lectures';
import axios from 'axios';

const MAX_IMAGES = 10;
const TEMP_LECTURE_ID = -1;

function isPdf(file: File) {
  return file.type === 'application/pdf';
}
function isImage(file: File) {
  return file.type.startsWith('image/');
}

function isTempLecture(lec: LectureDto): boolean {
  return lec.id === TEMP_LECTURE_ID;
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
  const [progressStep, setProgressStep] = useState(0);
  const abortRef = useRef<AbortController | null>(null);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pageHeaderRef = useRef<HTMLDivElement>(null);
  const lectureListRef = useRef<HTMLUListElement>(null);

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

  useEffect(() => {
    if (loading || notFound || !project) return;
    const header = pageHeaderRef.current;
    const rows = lectureListRef.current?.querySelectorAll('.lecture-row');
    const tl = gsap.timeline({ defaults: { ease: [0.25, 0.1, 0.25, 1] } });
    if (header) tl.fromTo(header, { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.32 });
    if (rows?.length) tl.fromTo(rows, { x: -16, opacity: 0 }, { x: 0, opacity: 1, duration: 0.28, stagger: 0.06 }, '-=0.18');
  }, [loading, notFound, project]);

  useEffect(() => {
    if (!lectureSubmitting) return;
    setProgressStep(1);
    const id = setInterval(() => {
      setProgressStep((s) => Math.min(3, s + 1));
    }, 10_000);
    progressIntervalRef.current = id;
    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    };
  }, [lectureSubmitting]);

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

  const handleCancelUpload = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort();
    }
  }, []);

  const handleSubmitLecture = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectId || !lectureTitle.trim() || !isValidFiles || lectureFiles.length === 0 || lectureSubmitting) return;
    setLectureError(null);
    const title = lectureTitle.trim();
    const tempLecture: LectureDto = { id: TEMP_LECTURE_ID, title: `${title} (обработка…)`, status: 'PROCESSING' };
    setLectures((prev) => [...prev, tempLecture]);
    setAddLectureOpen(false);
    setLectureSubmitting(true);
    const controller = new AbortController();
    abortRef.current = controller;
    try {
      const created = await apiCreateLecture(projectId, title, lectureFiles, { signal: controller.signal });
      setLectures((prev) => prev.map((l) => (isTempLecture(l) ? created : l)));
      setLectureTitle('');
      setLectureFiles([]);
      setAddLectureOpen(false);
    } catch (err) {
      setLectures((prev) => prev.filter((l) => !isTempLecture(l)));
      if (axios.isCancel(err)) {
        toast.error('Загрузка отменена.');
      } else {
        const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
        toast.error(msg ?? 'Не удалось добавить лекцию.');
      }
    } finally {
      setLectureSubmitting(false);
      abortRef.current = null;
      setProgressStep(0);
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
      <div className="rounded-2xl glass-card p-10 text-center">
        <p className="font-body text-[15px] text-white/90">Проект не найден.</p>
        <Button asChild className="mt-4 btn-pill bg-lime text-violet hover:bg-lime-dark hover:shadow-glow">
          <Link to="/app">На главную</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div ref={pageHeaderRef} className="flex items-center gap-5">
        <Button variant="ghost" size="icon" asChild className="text-white hover:bg-white/10 rounded-xl transition-all hover:scale-105">
          <Link to="/app">
            <ArrowRight size={20} className="rotate-180" />
          </Link>
        </Button>
        <div>
          <h1 className="font-heading text-2xl font-bold text-white lg:text-3xl">{project.name}</h1>
          <p className="mt-2 font-body text-[15px] text-white/75">Лекции проекта</p>
        </div>
      </div>

      <div className="space-y-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-heading text-lg font-semibold text-white">Лекции</h2>
          <Button
            type="button"
            className="btn-pill gap-2 bg-lime text-violet hover:bg-lime-dark hover:shadow-glow hover:-translate-y-0.5 transition-all"
            onClick={() => setAddLectureOpen((v) => !v)}
            disabled={lectureSubmitting}
          >
            <PlusCircle size={18} />
            Добавить лекцию
          </Button>
        </div>

        <AddLectureProgressModal open={lectureSubmitting} progressStep={progressStep} onCancel={handleCancelUpload} />

        {addLectureOpen && (
          <form onSubmit={handleSubmitLecture} className="rounded-2xl glass-card p-7 shadow-[0_20px_52px_-14px_rgba(0,0,0,0.32)]">
            <label className="mb-2.5 block font-label text-xs font-medium uppercase tracking-wider text-white/75">Название лекции</label>
            <Input
              value={lectureTitle}
              onChange={(e) => setLectureTitle(e.target.value)}
              className="mb-4 h-12 rounded-xl border-white/15 bg-white/5 text-white placeholder:text-white/50 focus-visible:ring-2 focus-visible:ring-lime/40"
              required
              disabled={lectureSubmitting}
            />
            <label className="mb-2 block font-label text-xs uppercase tracking-wider text-white/70">Файлы</label>
            <p className="mb-2 font-body text-sm text-white/60">Либо 1 PDF (до 10 страниц), либо до 10 изображений.</p>
            <div className="flex flex-wrap items-center gap-3">
              <input
                type="file"
                accept=".pdf,image/*"
                multiple
                onChange={(e) => handleAddLectureFiles(Array.from(e.target.files ?? []))}
                className="hidden"
                id="lecture-files"
                disabled={lectureSubmitting}
              />
              <label
                htmlFor="lecture-files"
                className={`inline-flex cursor-pointer items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-4 py-2 font-body text-sm text-white hover:bg-white/10 ${lectureSubmitting ? 'pointer-events-none opacity-60' : ''}`}
              >
                <Upload size={18} />
                Выбрать файлы
              </label>
              {lectureFiles.length > 0 && (
                <span className="font-body text-sm text-white/70">
                  {lectureFiles.map((f) => f.name).join(', ')}
                  <Button type="button" variant="ghost" size="sm" className="ml-2 text-white/70" onClick={() => setLectureFiles([])} disabled={lectureSubmitting}>
                    Очистить
                  </Button>
                </span>
              )}
            </div>
            {lectureError && <p className="mt-2 font-body text-sm text-red-400">{lectureError}</p>}
            <div className="mt-4 flex gap-2">
              <Button
                type="submit"
                className="btn-pill bg-lime text-violet hover:bg-lime-dark hover:shadow-glow transition-all"
                disabled={!lectureTitle.trim() || !isValidFiles || lectureFiles.length === 0 || lectureSubmitting}
              >
                {lectureSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Отправка…
                  </>
                ) : (
                  'Добавить'
                )}
              </Button>
              {!lectureSubmitting && (
                <Button type="button" variant="outline" className="btn-pill border-violet/30 bg-surface text-violet hover:bg-violet/10" onClick={() => setAddLectureOpen(false)}>
                  Отмена
                </Button>
              )}
            </div>
          </form>
        )}

        {(lectures?.length ?? 0) === 0 && !addLectureOpen && !lectureSubmitting ? (
          <p className="text-center font-body text-[15px] text-white/70 py-10">У вас не загружено ни одной лекции.</p>
        ) : (
          <ul ref={lectureListRef} className="space-y-4">
            {(lectures ?? []).map((lec) => (
              <li key={isTempLecture(lec) ? 'temp' : lec.id} className="lecture-row">
                {isTempLecture(lec) ? (
                  <div className="flex items-center justify-between rounded-xl glass-card px-6 py-4">
                    <span className="font-body text-[15px] text-white/85">{lec.title}</span>
                    <span className="rounded-full bg-white/15 px-2.5 py-0.5 font-label text-xs uppercase text-white/65">Обработка…</span>
                  </div>
                ) : (
                  <Link
                    to={`/app/projects/${projectId}/lectures/${lec.id}`}
                    className="flex items-center justify-between rounded-xl glass-card px-6 py-4 transition-all hover:bg-white/[0.1] hover:border-white/18 hover:shadow-[0_12px_32px_-8px_rgba(0,0,0,0.28)]"
                  >
                    <span className="font-body font-medium text-[15px] text-white">{lec.title}</span>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
