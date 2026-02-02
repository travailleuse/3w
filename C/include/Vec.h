#include <stdlib.h>
#define MAX_SIZE ((size_t)0xffff)

typedef struct Vec {
    void **data;
    size_t size;
    size_t cap;
} Vec;

Vec *createVec(size_t cap);

int append(void *);