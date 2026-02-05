#include <stdio.h>
#include "include/Vec.h"
#include "include/testPreSum.h"
#include "include/testCreateFile.h"

#include <windows.h>
#include <psapi.h>

void getMemoryUsage() {
    PROCESS_MEMORY_COUNTERS pmc;
    HANDLE hProcess = GetCurrentProcess();

    if (GetProcessMemoryInfo(hProcess, &pmc, sizeof(pmc))) {
        printf("Peak Working Set Size: %zu bytes\n", pmc.PeakWorkingSetSize);
        printf("Current Working Set Size: %zu bytes\n", pmc.WorkingSetSize);
        printf("Pagefile Usage: %zu bytes\n", pmc.PagefileUsage);
    }
}



int main(void) {

    timeEscapeWrapper(testAll, "testAll");
    return 0;
}
