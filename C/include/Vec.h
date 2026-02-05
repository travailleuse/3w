#include <stdlib.h>

#define _VEC_MAX_SIZE ((size_t)0xffff)

typedef struct Vec {
    void **data;
    size_t size;
    size_t cap;
} Vec;

Vec *vecCreate(size_t cap);

void vecDestroy(Vec *vec);

int vecInsert(Vec *vec, void *data, size_t idx);

void testVec();

