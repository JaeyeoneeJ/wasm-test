#include <stdlib.h>

float* CubicBSplineWeights(float t) {
    float* w = (float*)malloc(4 * sizeof(float));
    float t2 = t * t;
    float t3 = t * t2;

    w[0] = 1.0f / 6.0f * (-t3 + 3 * t2 - 3 * t + 1);
    w[1] = 1.0f / 6.0f * (3 * t3 - 6 * t2 + 4);
    w[2] = 1.0f / 6.0f * (-3 * t3 + 3 * t2 + 3 * t + 1);
    w[3] = 1.0f / 6.0f * t3;

    return w;
}