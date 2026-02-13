#include "../include/testCreateFile.h"
#include "../include/testPreSum.h"

#define _TEST_FILE_PREFIX "test"
#define _TEST_FILE_NUM 10

typedef struct File {
    FILE *fp;
    char name[20];
} File;

File files[_TEST_FILE_NUM];

void createFile() {
    for (int i = 0; i < _TEST_FILE_NUM; ++i) {
        sprintf(files[i].name, "test-%d.txt", i);
        files[i].fp = fopen(files[i].name, "w+");
    }
}

void *workForGenData(void *args) {
    File *file = (File*)(args);
    printf("file %s begin workForGenData\n", file->name);

    clock_t s, e;
    s = clock();
    for (int h = 0; h < 10000000; ++h) {
        for (int w = 0; w < 10; ++w) {
            int ele = rand() % 100;
            fprintf(file->fp, "%d ", ele);
        }
        fputs("\n", file->fp);
    }
    e = clock();
    double t = (e - s) * 1.00 / CLOCKS_PER_SEC * 1000;
    printf("file %s genData end, takes %.2lf (ms)\n", file->name, t);

    return NULL;
}

void generateRandomInt() {
    srand(42);

    pthread_t ths[_TEST_FILE_NUM];
    for (int i = 0; i < _TEST_FILE_NUM; ++i) {
        pthread_create(ths + i, NULL, workForGenData, files + i);
    }

    for (int i = 0; i < _TEST_FILE_NUM; ++i) {
        pthread_join(ths[i], NULL);
    }
}

void * workerForRead(void *args) {
    File *file = (File*)(args);
    printf("file %s begin workerForRead\n", file->name);
    clock_t s, e;
    s = clock();
    rewind(file->fp);
    int sx = -1;
    while (fscanf(file->fp, "%d", &sx) == 1){

    }
    e = clock();
    double t = (e - s) * 1.00 / CLOCKS_PER_SEC * 1000;
    printf("file %s readData end, takes %.2lf (ms)\n", file->name, t);
}
void readFiles() {
    printf("begin read all files\n");

    pthread_t ths[_TEST_FILE_NUM];
    for (int i = 0; i < _TEST_FILE_NUM; ++i) {
        pthread_create(ths + i, NULL, workerForRead, files + i);
    }

    for (int i = 0; i < _TEST_FILE_NUM; ++i) {
        pthread_join(ths[i], NULL);
    }

}


void closeAllFile() {
    for (int i = 0; i < _TEST_FILE_NUM; ++i) {
        fclose(files[i].fp);
    }
}

void removeAllFiles() {
    for (int i = 0; i < _TEST_FILE_NUM; ++i) {
        remove(files[i].name);
        puts(files[i].name);
    }
}


void testAll() {
    timeEscapeWrapper(createFile);
    timeEscapeWrapper(generateRandomInt);
    timeEscapeWrapper(readFiles);
    timeEscapeWrapper(closeAllFile);
    timeEscapeWrapper(removeAllFiles);
}