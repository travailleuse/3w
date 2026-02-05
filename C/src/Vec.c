#include "../include/Vec.h"
#include <stdlib.h>
#include <string.h>
#include <stdio.h>
#include <time.h>

Vec *vecCreate(size_t cap) {
    if (cap == 0 || cap > _VEC_MAX_SIZE) {
        return NULL;
    }

    Vec *vec = (Vec *) malloc(sizeof(Vec));
    if (vec == NULL) {
        return NULL;
    }
    vec->data = calloc(cap, sizeof(void *));
    if (vec->data == NULL) {
        free(vec);
        vec = NULL;
        return NULL;
    }
    vec->size = 0;
    vec->cap = cap;
    return vec;
}

void vecDestroy(Vec *vec) {
    if (vec == NULL) {
        return;
    }

    vec->cap = vec->size = 0;
    if (vec->data == NULL) {
        free(vec);
        vec = NULL;
        return;
    }

    free(vec->data);
    free(vec);
}

int vecInsert(Vec *vec, void *data, size_t idx) {
    if (idx > vec->size) {
        fprintf(stderr, "Index(%zu) out of bound, the range is [0, %zu].\n", idx, vec->size);
        return -1;
    }

    if (vec->size == vec->cap) {
        void **old = vec->data;
        size_t nn = vec->cap + (vec->cap >> 1) + 1;
        vec->data = (void **) calloc(nn, sizeof(void *));
        memcpy_s(vec->data, vec->cap * sizeof(void *), old, vec->size * sizeof(void *));
        vec->cap = nn;
        free(old);
    }

    for (size_t i = vec->size; i > idx; --i) {
        vec->data[i] = vec->data[i - 1];
    }
    vec->data[idx] = data;
    ++vec->size;
    return 1;
}

#define MAX 10000

int a[MAX];

void testVec() {
    Vec *vec = vecCreate(1);
    srand(time(NULL));
    for (int i = 0; i < MAX; ++i) {
        a[i] = i;//rand() % 100;
        vecInsert(vec, a + i, vec->size);
    }
    printf("size = %zu\n", vec->size);
    for (int i = 0; i < vec->size; ++i) {
        int *y = (int *) vec->data[i];
        printf("ele = %d\n", *y);
    }
    printf("size = %zu\n", vec->size);
    vecDestroy(vec);
}
