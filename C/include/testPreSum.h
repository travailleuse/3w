#include <pthread.h>
#include <stdlib.h>
#include <stdio.h>

typedef struct QueryParam {
    size_t l, r;
} QueryParam;


void testOrdinary();

void testPreSum();

void testOrdinaryMul();

void testPreSumMul();

void swap(void *a, void *b, size_t E, size_t N);

void initTestData();

void timeEscapeWrapper(void (*handler)(), const char *func);

void testAllPre();