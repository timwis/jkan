import select
import subprocess

def worker_pool(popen_arg, num_workers, job_iterable,
        stop_when_jobs_done=True, stop_on_keyboard_interrupt=True,
        popen=None):
    """
    Coroutine to manage a pool of workers that accept jobs as single lines
    of input on stdin and produces results as single lines of output.

    popen_arg - parameter to pass to subprocess.Popen when creating workers
    num_workers - maximum number of workers to create
    job_iterable - iterable producing (job id, job string) tuples where
                   job string should include a single trailing newline
    stop_when_jobs_done - True: generator exits when all jobs are done
    stop_on_keyboard_interrupt - True: generator exits on KeyboardIterrupt

    accepted to send(): job iterable or None, when a new job iterable is
    sent it will replace the previous one used for assigning jobs to workers

    This generator blocks until there is a result from one of the workers.

    yields (currently processing job id list, finished job id, job result)
    tuples as jobs are completed, or (None, None, None) when no jobs remain
    to be completed and stop_when_jobs_done is False.

    currently processing job id list will include None if some workers are
    idle.  job result will include trailing newline.

    when no jobs remain to be completed and stop_when_jobs_done is False a
    new job iterable must be sent to this generator with send().
    """
    if popen is None:
        popen = subprocess.Popen

    workers = []
    job_ids = []
    worker_fds = {}
    job_iter = iter(job_iterable)

    def start_job(worker=None):
        """
        assign a job to exiting or newly created worker subprocess.

        returns (job_id, worker) or (None, None) when no more jobs
        """
        job_id, job_str = next(job_iter, (None, None))
        if job_str is None:
            return None, None
        job_str = job_str.rstrip(b'\n') + b'\n'
        if not worker:
            worker = popen(
                popen_arg,
                stdin=subprocess.PIPE,
                stdout=subprocess.PIPE,
                )
        worker.stdin.write(job_str)
        worker.stdin.flush()
        return (job_id, worker)

    def assign_jobs():
        """
        start as many jobs as possible given maximum/idle workers
        and available jobs
        """
        while None in job_ids:
            wnum = job_ids.index(None)
            job_ids[wnum], w = start_job(workers[wnum])
            if w is None:
                return

        while len(workers) < num_workers:
            job_id, w = start_job()
            if w is None:
                return
            worker_fds[w.stdout] = len(workers)
            workers.append(w)
            job_ids.append(job_id)

    try:
        assign_jobs()
        while True:
            if all(i is None for i in job_ids):
                if stop_when_jobs_done:
                    return
                new_jobs = yield (None, None, None)
                # require new jobs to be submitted
                job_iter = iter(new_jobs)
                assign_jobs()
                continue

            try:
                readable, _, _ = select.select(worker_fds, [], [])
            except select.error as e:
                if e.args[0] == 10038:
                    # XXX: no many-worker support on windows yet
                    readable = list(worker_fds)[:1]
                else:
                    raise
            except KeyboardInterrupt:
                if stop_on_keyboard_interrupt:
                    return
                raise

            fd = readable[0]
            wnum = worker_fds[fd]
            w = workers[wnum]
            result = w.stdout.readline()
            finished = job_ids[wnum]
            job_ids[wnum], _ = start_job(w)

            new_jobs = yield (job_ids, finished, result)
            if new_jobs:
                job_iter = iter(new_jobs)
                assign_jobs()

    finally:
        for w in workers:
            w.stdin.close()
