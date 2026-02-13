#include <pthread.h>
#include <stdlib.h>
#include <stdio.h>
#include <time.h>

#define timeEscapeWrapper(func) do{ \
    clock_t s, e;                   \
    s = clock();                    \
    func();                         \
    e = clock();                    \
    double t = 1.0 * (e - s) / CLOCKS_PER_SEC * 1000; \
    printf("[%s] takes %.2lf(ms).\n", #func, t);              \
}while(0)
typedef struct QueryParam {
    size_t l, r;
} QueryParam;


void testOrdinary();

void testPreSum();

void testOrdinaryMul();

void testPreSumMul();

void swap(void *a, void *b, size_t E, size_t N);

void initTestData();

void testAllPre();