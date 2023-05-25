function LogGamma(Z) {
  with (Math) {
    var S = 1 + 76.18009173 / Z - 86.50532033 / (Z + 1) + 24.01409822 / (Z + 2) - 1.231739516 / (Z + 3) + .00120858003 / (Z + 4) - .00000536382 / (Z + 5);
    var LG = (Z - .5) * log(Z + 4.5) - (Z + 4.5) + log(S * 2.50662827465);
  }
  return LG
}

function Gser(X,A) {        // Good for X<A+1.
  with (Math) {
    var T9=1/A;
    var G=T9;
    var I=1;
    while (T9>G*.00001) {
      T9=T9*X/(A+I);
      G=G+T9;
      I=I+1;
    }
    G=G*exp(A*log(X)-X-LogGamma(A));
  }
  return G
}

function Gcf(X, A) {        // Good for X>A+1
  with (Math) {
    var A0 = 0;
    var B0 = 1;
    var A1 = 1;
    var B1 = X;
    var AOLD = 0;
    var N = 0;
    while (abs((A1 - AOLD) / A1) > .00001) {
      AOLD = A1;
      N = N + 1;
      A0 = A1 + (N - A) * A0;
      B0 = B1 + (N - A) * B0;
      A1 = X * A0 + N * A1;
      B1 = X * B0 + N * B1;
      A0 = A0 / B1;
      B0 = B0 / B1;
      A1 = A1 / B1;
      B1 = 1;
    }
    var Prob = exp(A * log(X) - X - LogGamma(A)) * A1;
  }
  return 1 - Prob
}

function Gammacdf(x, a) {
  var GI;
  if (x <= 0) {
    GI = 0
  } else if (a > 200) {
    z = (x - a) / Math.sqrt(a)
    y = normalcdf(z)
    b1 = 2 / Math.sqrt(a)
    phiz = .39894228 * Math.exp(-z * z / 2)
    w = y - b1 * (z * z - 1) * phiz / 6  //Edgeworth1
    b2 = 6 / a
    u = 3 * b2 * (z * z - 3) + b1 * b1 * (z ^ 4 - 10 * z * z + 15)
    GI = w - phiz * z * u / 72        //Edgeworth2
  } else if (x < a + 1) {
    GI = Gser(x, a)
  } else {
    GI = Gcf(x, a)
  }
  return GI
}
