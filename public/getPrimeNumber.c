#include <stdlib.h>
#include <stdio.h>
#include <emscripten.h>

int IsPrime(int value) {
    if (value==2) return 1;
    if (value < 2 || value % 2 == 0) return 0;
    for(int i=3;i*i<=value;i++) {
        if(value % i == 0) 
        return 0;
    }
    return 1;
}

int main(){
    int start = 1;
    int end = 1000;

    printf("Prime numbers between %d and %d:\n", start, end);

    for (int i=start;i<=end;i++) {
        if(IsPrime(i))
            printf("%d ", i);
    }
    printf("\n");
    return 0;
}