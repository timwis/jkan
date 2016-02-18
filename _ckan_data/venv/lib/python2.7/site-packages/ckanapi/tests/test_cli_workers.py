from ckanapi.cli.workers import worker_pool
import os

try:
    import unittest2 as unittest
except ImportError:
    import unittest


class _MockPopen(object):
    def __init__(self, popen_args, stdin, stdout):
        read1fd, write1fd = os.pipe()
        read2fd, write2fd = os.pipe()
        self.stdin = os.fdopen(write1fd, 'wb')
        self.stdin_inside = os.fdopen(read1fd, 'rb')
        self.stdout = os.fdopen(read2fd, 'rb')
        self.stdout_inside = os.fdopen(write2fd, 'wb')
        # use popen_args as an after-create callback
        popen_args(self)

    def stdout_write(self, data):
        self.stdout_inside.write(data)
        self.stdout_inside.flush()

    def stdin_readline(self):
        return self.stdin_inside.readline()

    def close_pipes(self):
        for f in (self.stdin, self.stdin_inside, self.stdout, self.stdout_inside):
            f.close()


class TestCLIWorkers(unittest.TestCase):
    def test_one(self):
        children = []
        def child_created(child):
            # need to respond or pool will block test
            child.stdout_write(b'AA\n')
            children.append(child)
        pool = worker_pool(
            child_created,
            1,
            enumerate((b"job1\n", b"job2\n")),
            popen=_MockPopen,
            )
        response = next(pool)
        self.assertEqual(len(children), 1)
        c = children[0]
        self.assertEqual(c.stdin_readline(), b'job1\n')
        self.assertEqual(response, ([1], 0, b'AA\n'))
        self.assertEqual(c.stdin_readline(), b'job2\n')
        c.stdout_write(b'BB\n')
        self.assertEqual(next(pool), ([None], 1, b'BB\n'))
        self.assertRaises(StopIteration, next, pool)
        for c in children:
            c.close_pipes()

    def test_two(self):
        children = []
        def child_created(child):
            # first child responds
            if not children:
                child.stdout_write(b'AA\n')
            children.append(child)
        pool = worker_pool(
            child_created,
            2,
            enumerate((b"job1\n", b"job2\n", b"job3\n", b"job4\n")),
            popen=_MockPopen,
            )
        response = next(pool)
        self.assertEqual(len(children), 2)
        c0, c1 = children
        self.assertEqual(c0.stdin_readline(), b'job1\n')
        self.assertEqual(c1.stdin_readline(), b'job2\n')
        self.assertEqual(response, ([2, 1], 0, b'AA\n'))
        self.assertEqual(c0.stdin_readline(), b'job3\n')
        c1.stdout_write(b'BB\n')
        self.assertEqual(next(pool), ([2, 3], 1, b'BB\n'))
        self.assertEqual(c1.stdin_readline(), b'job4\n')
        c0.stdout_write(b'CC\n')
        self.assertEqual(next(pool), ([None, 3], 2, b'CC\n'))
        c1.stdout_write(b'DD\n')
        self.assertEqual(next(pool), ([None, None], 3, b'DD\n'))
        self.assertRaises(StopIteration, next, pool)
        for c in children:
            c.close_pipes()

    def test_uneven(self):
        children = []
        def child_created(child):
            # second child responds
            if children:
                child.stdout_write(b'AA\n')
            children.append(child)
        pool = worker_pool(
            child_created,
            2,
            enumerate((b"job1\n", b"job2\n", b"job3\n", b"job4\n")),
            popen=_MockPopen,
            )
        response = next(pool)
        self.assertEqual(len(children), 2)
        c0, c1 = children
        self.assertEqual(c0.stdin_readline(), b'job1\n')
        self.assertEqual(c1.stdin_readline(), b'job2\n')
        self.assertEqual(response, ([0, 2], 1, b'AA\n'))
        self.assertEqual(c1.stdin_readline(), b'job3\n')
        c1.stdout_write(b'BB\n')
        self.assertEqual(next(pool), ([0, 3], 2, b'BB\n'))
        self.assertEqual(c1.stdin_readline(), b'job4\n')
        c1.stdout_write(b'CC\n')
        self.assertEqual(next(pool), ([0, None], 3, b'CC\n'))
        c0.stdout_write(b'DD\n')
        self.assertEqual(next(pool), ([None, None], 0, b'DD\n'))
        self.assertRaises(StopIteration, next, pool)
        for c in children:
            c.close_pipes()

    def test_overkill(self):
        children = []
        def child_created(child):
            if not children:
                child.stdout_write(b'AA\n')
            children.append(child)
        pool = worker_pool(
            child_created,
            10,
            enumerate((b"job1\n",)),
            popen=_MockPopen,
            )
        response = next(pool)
        self.assertEqual(len(children), 1)
        c = children[0]
        self.assertEqual(c.stdin_readline(), b'job1\n')
        self.assertEqual(response, ([None], 0, b'AA\n'))
        self.assertRaises(StopIteration, next, pool)
        for c in children:
            c.close_pipes()

    def test_batch(self):
        children = []
        def child_created(child):
            if not children:
                child.stdout_write(b'AA\n')
            children.append(child)
        pool = worker_pool(
            child_created,
            2,
            enumerate((b"job1\n",)),
            stop_when_jobs_done=False,
            popen=_MockPopen,
            )
        response = next(pool)
        self.assertEqual(len(children), 1)
        c0 = children[0]
        self.assertEqual(c0.stdin_readline(), b'job1\n')
        self.assertEqual(response, ([None], 0, b'AA\n'))
        self.assertEqual(next(pool), (None, None, None))
        # need to write in advance to avoid blocking test
        c0.stdout_write(b'BB\n')
        response = pool.send(enumerate((b"job2\n", b"job3\n"), 1))
        self.assertEqual(response, ([None, 2], 1, b'BB\n'))
        for c in children:
            c.close_pipes()
