#include "../include/testPreSum.h"


#define _TEST_MAX_SIZE ((size_t)(1E7))
#define _TEST_NUM_THS 10
#define _TEST_MAX_ELE 100
#define _TEST_MAX_PARAM ((size_t)(1E6))


int _data[_TEST_MAX_SIZE];
int _preSum[_TEST_MAX_SIZE];

QueryParam _params[_TEST_MAX_PARAM];

void swap(void *a, void *b, size_t E, size_t N) {
    unsigned char *p = (unsigned char *) a, *q = (unsigned char *) b;
    unsigned char *e = p + N * E;
    while (p < e) {
        *p ^= *q;
        *q ^= *p;
        *p ^= *q;
        ++p;
        ++q;
    }
}

void timeEscapeWrapper(void (*handler)(), const char *func) {
    clock_t s, e;
    s = clock();
    handler();
    e = clock();
    double t = (e - s) * 1.0 / CLOCKS_PER_SEC;
    printf("[%s] takes %.2f ms.\n", func, t * 1000);
}

static void *workForInitTestData(void *args) {
    size_t s = ((QueryParam *) args)->l;

    size_t sd = s * (_TEST_MAX_SIZE / _TEST_NUM_THS);
    size_t sp = s * (_TEST_MAX_PARAM / _TEST_NUM_THS);

    size_t ed = sd + (_TEST_MAX_SIZE / _TEST_NUM_THS);
    size_t ep = sp + (_TEST_MAX_PARAM / _TEST_NUM_THS);

    for (int i = sd; i < ed; ++i) {
        _data[i] = rand() % _TEST_MAX_ELE;
    }

    for (int i = sp; i < ep; ++i) {
        _params[i].l = rand() % _TEST_MAX_SIZE;
        _params[i].r = rand() % _TEST_MAX_SIZE;
        if (_params[i].l > _params[i].r) {
            swap(&(_params[i].l), &(_params[i].r), sizeof(QueryParam), 1);
        }
    }


    return NULL;
}

void initTestData() {
    srand(time(NULL));

    QueryParam *qs = (QueryParam *) calloc(_TEST_NUM_THS, sizeof(QueryParam));

    pthread_t ths[_TEST_NUM_THS];

    for (int i = 0; i < _TEST_NUM_THS; ++i) {
        qs[i].l = i;
        pthread_create(ths + i, NULL, workForInitTestData, qs + i);
    }

    for (int i = 0; i < _TEST_NUM_THS; ++i) {
        pthread_join(ths[i], NULL);
    }


    free(qs);
}

void testOrdinary() {
    QueryParam *p = _params, *q = _params + _TEST_MAX_PARAM;
    size_t l = 0, r = 0;
    int *pp = NULL, *qq = NULL;
    while (p < q) {
        l = p->l;
        r = p->r;
        pp = _data + l;
        qq = _data + r;
        int s = 0;
        while (pp <= qq)s += *pp++;
        ++p;
    }
}

void testPreSum() {
    _preSum[0] = _data[0];
    for (int i = 1; i < _TEST_MAX_SIZE; ++i) {
        _preSum[i] = _data[i] + _preSum[i - 1];
    }

    QueryParam *p = _params, *q = _params + _TEST_MAX_PARAM;
    size_t l = 0, r = 0;
    while (p < q) {
        l = p->l;
        r = p->r;
        int s = _preSum[r];
        if (l > 0) s -= _preSum[l - 1];
        ++p;
    }
}

static void *workForTestOrdinaryMul(void *args) {
    QueryParam *param = (QueryParam *) args;

    QueryParam *p = _params + param->l, *q = _params + param->r;
    size_t l = 0, r = 0;
    int *pp = NULL, *qq = NULL;
    while (p < q) {
        l = p->l;
        r = p->r;
        pp = _data + l;
        qq = _data + r;
        int s = 0;
        while (pp <= qq)s += *pp++;
        ++p;
    }

    return NULL;
}

void testOrdinaryMul() {


    pthread_t ths[_TEST_NUM_THS];
    QueryParam *qs = (QueryParam *) calloc(_TEST_NUM_THS, sizeof(QueryParam));
    for (int i = 0; i < _TEST_NUM_THS; ++i) {
        qs[i].l = i * (_TEST_MAX_PARAM / _TEST_NUM_THS);
        qs[i].r = qs[i].l + (_TEST_MAX_PARAM / _TEST_NUM_THS);
        pthread_create(ths + i, NULL, workForTestOrdinaryMul, qs + i);
    }

    for (int i = 0; i < _TEST_NUM_THS; ++i) {
        pthread_join(ths[i], NULL);
    }

    free(qs);
}

static void *workForTestPreSumMul(void *args) {
    QueryParam *param = (QueryParam *) args;
    QueryParam *p = _params + param->l, *q = _params + param->r;
    size_t l = 0, r = 0;
    while (p < q) {
        l = p->l;
        r = p->r;
        int s = _preSum[r];
        if (l > 0) s -= _preSum[l - 1];
        ++p;
    }
}

void testPreSumMul() {
    _preSum[0] = _data[0];
    for (int i = 1; i < _TEST_MAX_SIZE; ++i) {
        _preSum[i] = _data[i] + _preSum[i - 1];
    }

    pthread_t ths[_TEST_NUM_THS];
    QueryParam *qs = (QueryParam *) calloc(_TEST_NUM_THS, sizeof(QueryParam));
    for (int i = 0; i < _TEST_NUM_THS; ++i) {
        qs[i].l = i * (_TEST_MAX_PARAM / _TEST_NUM_THS);
        qs[i].r = qs[i].l + (_TEST_MAX_PARAM / _TEST_NUM_THS);
        pthread_create(ths + i, NULL, workForTestPreSumMul, qs + i);
    }

    for (int i = 0; i < _TEST_NUM_THS; ++i) {
        pthread_join(ths[i], NULL);
    }

    free(qs);
}

void testAllPre() {
    timeEscapeWrapper(initTestData, "initTestData");
    timeEscapeWrapper(testOrdinary, "testOrdinary");
    timeEscapeWrapper(testPreSum, "testPreSum");
    timeEscapeWrapper(testOrdinaryMul, "testOrdinaryMul");
    timeEscapeWrapper(testPreSumMul, "testPreSumMul");
}
