#include "../include/Vec.h"

Vec *createVec(size_t cap) {
    if (cap == 0 || cap > MAX_SIZE) {
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