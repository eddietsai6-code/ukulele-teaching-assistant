import * as React from "react";

export type UkebookLogoProps = React.SVGProps<SVGSVGElement> & {
  title?: string;
  description?: string;
};

export function UkebookLogo({
  title = "UkeBook x Eddie Level Atlas logo",
  description = "Editable tropical badge logo with ukulele, Eddie monogram, UkeBook wordmark, palms, flowers, waves, and sunrise.",
  ...props
}: UkebookLogoProps) {
  const uid = React.useId().replace(/:/g, "");
  const id = (name: string) => `${uid}-${name}`;
  const titleId = id("title");
  const descId = id("desc");
  const strapGradient = id("strapGradient");
  const clipGradient = id("clipGradient");
  const badgeRimGradient = id("badgeRimGradient");
  const badgeFaceGradient = id("badgeFaceGradient");
  const skyGradient = id("skyGradient");
  const oceanGradient = id("oceanGradient");
  const ukeBodyGradient = id("ukeBodyGradient");
  const neckGradient = id("neckGradient");
  const headstockGradient = id("headstockGradient");
  const leafGradient = id("leafGradient");
  const hibiscusGradient = id("hibiscusGradient");
  const softShadow = id("softShadow");
  const wordShadow = id("wordShadow");
  const badgeClip = id("badgeClip");
  const eddieArc = id("eddieArc");

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1024 1200"
      role="img"
      aria-labelledby={`${titleId} ${descId}`}
      {...props}
    >
      <title id={titleId}>{title}</title>
      <desc id={descId}>{description}</desc>
      <defs>
        <linearGradient id={strapGradient} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#042f2b" />
          <stop offset="0.5" stopColor="#0b6258" />
          <stop offset="1" stopColor="#042f2b" />
        </linearGradient>
        <linearGradient id={clipGradient} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#fffdf1" />
          <stop offset="0.55" stopColor="#f4efe0" />
          <stop offset="1" stopColor="#c6c1b4" />
        </linearGradient>
        <linearGradient id={badgeRimGradient} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#f8f0d9" />
          <stop offset="0.45" stopColor="#0a594f" />
          <stop offset="1" stopColor="#041f1d" />
        </linearGradient>
        <linearGradient id={badgeFaceGradient} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#0a7469" />
          <stop offset="0.34" stopColor="#0b625b" />
          <stop offset="0.72" stopColor="#075047" />
          <stop offset="1" stopColor="#032d2b" />
        </linearGradient>
        <linearGradient id={skyGradient} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#64d6aa" />
          <stop offset="0.34" stopColor="#a9efd4" />
          <stop offset="0.58" stopColor="#fff0a2" />
          <stop offset="1" stopColor="#0a6a63" />
        </linearGradient>
        <linearGradient id={oceanGradient} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#76e4c5" />
          <stop offset="0.48" stopColor="#1fa89c" />
          <stop offset="1" stopColor="#075047" />
        </linearGradient>
        <linearGradient id={ukeBodyGradient} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#fff2a8" />
          <stop offset="0.36" stopColor="#ffd45e" />
          <stop offset="0.72" stopColor="#e99d2e" />
          <stop offset="1" stopColor="#9a5d1f" />
        </linearGradient>
        <linearGradient id={neckGradient} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#3a210f" />
          <stop offset="0.44" stopColor="#8a531f" />
          <stop offset="1" stopColor="#2b170b" />
        </linearGradient>
        <linearGradient id={headstockGradient} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#9bf17f" />
          <stop offset="0.5" stopColor="#5fd96f" />
          <stop offset="1" stopColor="#178552" />
        </linearGradient>
        <linearGradient id={leafGradient} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#072f24" />
          <stop offset="0.56" stopColor="#1e9b55" />
          <stop offset="1" stopColor="#b8f35a" />
        </linearGradient>
        <linearGradient id={hibiscusGradient} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#fff6a9" />
          <stop offset="0.56" stopColor="#ffd166" />
          <stop offset="1" stopColor="#f28e2b" />
        </linearGradient>
        <filter id={softShadow} x="-20%" y="-20%" width="140%" height="150%">
          <feDropShadow dx="0" dy="24" stdDeviation="24" floodColor="#06211f" floodOpacity="0.32" />
        </filter>
        <filter id={wordShadow} x="-15%" y="-30%" width="130%" height="170%">
          <feDropShadow dx="0" dy="12" stdDeviation="4" floodColor="#001918" floodOpacity="0.85" />
        </filter>
        <clipPath id={badgeClip}>
          <path d="M197 285 C218 210 302 174 512 174 C722 174 806 210 827 285 L878 842 C891 984 821 1068 512 1068 C203 1068 133 984 146 842 Z" />
        </clipPath>
        <path id={eddieArc} d="M306 349 C388 299 636 299 718 349" />
      </defs>

      <g id="strap" filter={`url(#${softShadow})`}>
        <path d="M470 0 H554 V145 H470 Z" fill={`url(#${strapGradient})`} />
        <path d="M501 18 H523 V92" fill="none" stroke="#ff7a24" strokeWidth="15" strokeLinecap="round" />
      </g>

      <g id="clip">
        <rect x="326" y="88" width="372" height="124" rx="57" fill="#f7f1df" stroke="#0a332f" strokeWidth="16" />
        <rect x="344" y="104" width="336" height="92" rx="44" fill={`url(#${clipGradient})`} stroke="#b5b0a4" strokeWidth="6" />
        <text x="512" y="170" textAnchor="middle" fontFamily="Arial Black, Montserrat, sans-serif" fontSize="72" fontWeight="900" fill="#07594f" letterSpacing="-8">E</text>
        <rect x="550" y="139" width="36" height="12" rx="6" fill="#ff8a2a" />
        <rect x="470" y="200" width="84" height="38" rx="19" fill="#071f1e" stroke="#f8f0d9" strokeWidth="6" />
      </g>

      <g id="badge-shell" filter={`url(#${softShadow})`}>
        <path d="M190 270 C214 198 307 156 512 156 C717 156 810 198 834 270 L891 850 C906 1007 824 1094 512 1094 C200 1094 118 1007 133 850 Z" fill={`url(#${badgeRimGradient})`} />
        <path d="M208 288 C230 226 314 191 512 191 C710 191 794 226 816 288 L861 840 C874 967 808 1036 512 1036 C216 1036 150 967 163 840 Z" fill="#f8f0d9" />
        <path d="M226 302 C246 248 326 218 512 218 C698 218 778 248 798 302 L838 828 C849 936 790 994 512 994 C234 994 175 936 186 828 Z" fill={`url(#${badgeFaceGradient})`} stroke="#062d2a" strokeWidth="10" />
      </g>

      <g id="tropical-scene" clipPath={`url(#${badgeClip})`}>
        <rect x="148" y="178" width="728" height="890" fill={`url(#${skyGradient})`} />
        <circle cx="512" cy="514" r="105" fill="#ffd166" />
        <g stroke="#fff6a9" strokeWidth="9" strokeLinecap="round" opacity="0.78">
          <path d="M512 350 V255" />
          <path d="M445 366 L390 278" />
          <path d="M579 366 L634 278" />
          <path d="M380 424 L274 372" />
          <path d="M644 424 L750 372" />
          <path d="M348 510 H230" />
          <path d="M676 510 H794" />
        </g>
        <g fill="#fff8dc" opacity="0.96">
          <path d="M236 500 C244 467 287 460 302 489 C324 456 385 474 384 520 H236 Z" />
          <path d="M640 492 C653 458 694 461 706 488 C730 462 787 480 788 520 H640 Z" />
        </g>
        <path d="M126 594 C204 554 286 552 365 592 C451 637 561 628 640 586 C725 540 819 550 913 606 V1068 H126 Z" fill={`url(#${oceanGradient})`} />
        <g fill="none" strokeLinecap="round">
          <path d="M158 664 C220 632 270 636 330 664 C406 700 468 702 544 662 C620 622 698 623 777 668" stroke="#c7ffd9" strokeWidth="16" opacity="0.76" />
          <path d="M171 732 C232 698 302 708 368 736 C436 765 507 764 586 724 C668 682 746 694 829 737" stroke="#7cf6c2" strokeWidth="13" opacity="0.78" />
          <path d="M148 804 C221 779 290 785 360 810 C440 840 510 840 590 803 C673 764 752 770 848 818" stroke="#0b726a" strokeWidth="18" opacity="0.76" />
          <path d="M206 887 C288 858 346 870 423 900 C500 930 588 917 666 882 C734 852 790 858 870 899" stroke="#9ef0c4" strokeWidth="11" opacity="0.75" />
        </g>
        <g id="palms" stroke="#062d2a" strokeLinecap="round" strokeLinejoin="round">
          <g transform="translate(278 724) rotate(-10)">
            <path d="M0 120 C24 62 18 14 -6 -44" fill="none" stroke="#7f5620" strokeWidth="22" />
            <g fill={`url(#${leafGradient})`} strokeWidth="7">
              <path d="M-8 -52 C-84 -96 -126 -76 -157 -42 C-96 -51 -56 -42 -8 -52 Z" />
              <path d="M-8 -52 C-67 -134 -112 -135 -155 -111 C-99 -95 -60 -77 -8 -52 Z" />
              <path d="M-8 -52 C-11 -144 24 -171 76 -174 C43 -130 21 -92 -8 -52 Z" />
              <path d="M-8 -52 C64 -119 111 -110 145 -77 C85 -77 42 -65 -8 -52 Z" />
              <path d="M-8 -52 C72 -65 116 -36 130 12 C79 -16 38 -36 -8 -52 Z" />
            </g>
          </g>
          <g transform="translate(756 735) rotate(11)">
            <path d="M0 116 C-22 56 -18 9 7 -48" fill="none" stroke="#7f5620" strokeWidth="20" />
            <g fill={`url(#${leafGradient})`} strokeWidth="7">
              <path d="M7 -56 C83 -100 128 -77 156 -40 C96 -52 55 -43 7 -56 Z" />
              <path d="M7 -56 C67 -134 111 -136 153 -109 C98 -96 57 -77 7 -56 Z" />
              <path d="M7 -56 C8 -145 -24 -173 -77 -173 C-40 -130 -19 -91 7 -56 Z" />
              <path d="M7 -56 C-67 -119 -111 -108 -145 -75 C-84 -77 -42 -65 7 -56 Z" />
              <path d="M7 -56 C-72 -66 -117 -35 -130 13 C-78 -17 -37 -38 7 -56 Z" />
            </g>
          </g>
        </g>
        <g id="flowers" stroke="#062d2a" strokeWidth="6" strokeLinejoin="round">
          {[245, 797].map((x, index) => (
            <g key={x} transform={`translate(${x} ${index ? 893 : 890})${index ? " scale(0.92)" : ""}`}>
              {[0, 72, 144, 216, 288].map((rotation) => (
                <ellipse key={rotation} cx="0" cy="-28" rx="26" ry="54" fill={`url(#${hibiscusGradient})`} transform={`rotate(${rotation})`} />
              ))}
              <circle r="13" fill="#7b4b13" />
            </g>
          ))}
        </g>
        <g fill="none" stroke="#05362f" strokeWidth="9" strokeLinecap="round">
          <path d="M432 490 C452 472 474 472 493 490" />
          <path d="M531 489 C552 470 575 470 594 489" />
        </g>
        <g id="music-note" transform="translate(758 626)" fill="#f8f0d9" stroke="#062d2a" strokeWidth="10" strokeLinejoin="round">
          <path d="M34 20 V118" fill="none" strokeLinecap="round" />
          <path d="M34 22 L94 6 V103 L34 118 Z" />
          <ellipse cx="18" cy="126" rx="31" ry="23" transform="rotate(-18 18 126)" />
        </g>
      </g>

      <g id="ukulele-hero" transform="rotate(18 598 596)" strokeLinecap="round" strokeLinejoin="round">
        <path d="M566 304 C562 528 562 528 548 713" stroke="#f8f0d9" strokeWidth="122" />
        <path d="M566 304 C562 528 562 528 548 713" stroke="#062d2a" strokeWidth="102" />
        <path d="M566 304 C562 528 562 528 548 713" stroke={`url(#${neckGradient})`} strokeWidth="72" />
        <g stroke="#f8f0d9" strokeWidth="6" opacity="0.72">
          <path d="M530 355 H604" />
          <path d="M528 404 H602" />
          <path d="M526 453 H600" />
          <path d="M523 505 H598" />
          <path d="M520 558 H595" />
          <path d="M517 611 H592" />
        </g>
        <path d="M512 630 C441 568 337 614 330 718 C323 814 416 852 493 813 C551 909 703 874 728 760 C751 657 617 580 540 649 C532 642 522 635 512 630 Z" fill="#062d2a" />
        <path d="M512 630 C449 579 359 619 353 711 C347 792 425 824 492 786 C545 873 675 839 696 748 C716 665 605 600 540 672 C531 654 523 641 512 630 Z" fill={`url(#${ukeBodyGradient})`} stroke="#f8f0d9" strokeWidth="16" />
        <path d="M407 702 C430 653 486 646 525 682" fill="none" stroke="#fff4b8" strokeWidth="7" opacity="0.62" />
        <path d="M580 692 C636 699 660 741 641 792" fill="none" stroke="#b86c1f" strokeWidth="13" opacity="0.45" />
        <circle cx="528" cy="735" r="54" fill="#062d2a" stroke="#f8f0d9" strokeWidth="8" />
        <rect x="444" y="844" width="176" height="38" rx="10" fill="#5a3516" stroke="#062d2a" strokeWidth="8" />
        <g stroke="#fffbe6" strokeWidth="5">
          <path d="M534 276 L474 861" />
          <path d="M556 276 L509 861" />
          <path d="M578 276 L545 861" />
          <path d="M600 276 L580 861" />
        </g>
        <g id="headstock">
          <path d="M506 160 C528 118 618 118 642 160 L660 257 C632 294 525 294 496 257 Z" fill="#062d2a" />
          <path d="M523 172 C541 138 609 138 626 172 L640 248 C615 270 542 270 516 248 Z" fill={`url(#${headstockGradient})`} stroke="#f8f0d9" strokeWidth="8" />
          <text x="581" y="230" textAnchor="middle" fill="#f8f0d9" fontFamily="Georgia, serif" fontSize="70" fontWeight="900">E</text>
          <g fill="#f8f0d9" stroke="#062d2a" strokeWidth="6">
            <circle cx="505" cy="194" r="18" />
            <circle cx="649" cy="194" r="18" />
            <circle cx="511" cy="252" r="18" />
            <circle cx="643" cy="252" r="18" />
          </g>
        </g>
      </g>

      <g id="badge-highlights" fill="none" pointerEvents="none">
        <path d="M243 316 C275 260 356 237 512 237 C668 237 749 260 781 316" stroke="#c9f5d5" strokeWidth="8" opacity="0.62" />
        <path d="M215 822 C246 945 316 976 512 976 C708 976 778 945 809 822" stroke="#f8f0d9" strokeWidth="8" opacity="0.5" />
        <path d="M228 323 L187 824" stroke="#fff7df" strokeWidth="5" opacity="0.42" />
        <path d="M796 323 L837 824" stroke="#032d2b" strokeWidth="7" opacity="0.35" />
      </g>

      <g id="wordmark" filter={`url(#${wordShadow})`}>
        <text x="512" y="913" textAnchor="middle" fill="#fff8df" stroke="#062d2a" strokeWidth="24" paintOrder="stroke" fontFamily="Georgia, 'Times New Roman', serif" fontSize="150" fontWeight="900" fontStyle="italic" letterSpacing="-6">UkeBook</text>
      </g>
      <g id="bottom-label">
        <path d="M328 986 H436" stroke="#83e5c2" strokeWidth="5" strokeLinecap="round" />
        <path d="M588 986 H696" stroke="#83e5c2" strokeWidth="5" strokeLinecap="round" />
        <text x="512" y="1004" textAnchor="middle" fill="#bdf4d5" stroke="#062d2a" strokeWidth="3" paintOrder="stroke" fontFamily="Arial Black, Montserrat, sans-serif" fontSize="44" fontWeight="900" letterSpacing="9">LEVEL ATLAS</text>
      </g>
      <text id="eddie-word" fill="#ffd166" stroke="#0b3a2d" strokeWidth="4" paintOrder="stroke" fontFamily="Arial Black, Montserrat, sans-serif" fontSize="62" fontWeight="900" letterSpacing="13">
        <textPath href={`#${eddieArc}`} startOffset="50%" textAnchor="middle">EDDIE</textPath>
      </text>
    </svg>
  );
}

export default UkebookLogo;
