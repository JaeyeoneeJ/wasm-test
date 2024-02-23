#include <emscripten/emscripten.h>
#include <stdio.h>
#include <stdlib.h>

EMSCRIPTEN_KEEPALIVE
int add(int x, int y) {
  return x + y;
}

EMSCRIPTEN_KEEPALIVE
int* array(int size, int a, int b) {
  int* result = (int*)malloc(size * sizeof(int));  // 배열 크기 정보를 위한 추가 공간 확보
  if(result == NULL) {
    fprintf(stderr, "메모리 할당에 실패했습니다.\n");
    exit(1);
  }

  for (int i = 0; i < size; i++) {
    result[i] = a * b * i;
    printf("result[%d] = %d", i, result[i]);
  }

  return result;
}

