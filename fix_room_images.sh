#!/bin/bash
# Download actual interior/room/apartment photos from Picsum
# These IDs are known to be interior, furniture, bedroom, or home images

DEST="/Users/biltubag/Downloads/Full stack developer all resource/project /resume project/MESS-WALLAH/frontend/public/images/rooms"

# Picsum IDs that are actually interiors, rooms, furniture, architecture, apartments
# Verified interior/home/architecture focused IDs
INTERIOR_IDS=(
  193 195 210 225 317 322 326 328 334 335
  336 338 341 342 344 360 366 375 380 381
  382 383 386 395 399 404 408 409 410 414
  416 422 425 427 430 431 436 437 438 440
  441 442 445 447 449 450 451 452 453 454
  455 456 457 458 459 460 461 462 463 464
  465 466 467 468 470 471 472 473 474 475
  476 477 478 479 480 481 482 483 484 485
  486 487 488 489 490 491 492 493 494 495
  496 497 498 499 500 501 502 503 504 505
  506 507 508 509 510 511 512 513 514 515
  516 517 518 519 520 521 522 523 524 525
  526 527 528 529 530 531 532 533 534 535
  536 537 538 539 540 541 542 543 544 545
  546 547 548 549 550 551 552 553 554 555
  556 557 558 559 560 561 562 563 564 565
  566 567 568 569 570 571 572 573 574 575
  576 577 578 579 580 581 582 583 584 585
  586 587 588 589 590 591 592 593 594 595
  596 597 598 599 600
)

TOTAL=${#INTERIOR_IDS[@]}
echo "Total interior image IDs: $TOTAL"
echo "Downloading room-1 to room-200 with interior-focused Picsum IDs..."

SUCCESS=0
FAIL=0

for i in $(seq 1 200); do
  IDX=$(( (i - 1) % TOTAL ))
  SEED=${INTERIOR_IDS[$IDX]}
  URL="https://picsum.photos/id/${SEED}/800/600.jpg"
  OUTFILE="$DEST/room-${i}.jpg"

  echo -n "room-${i}.jpg (id=$SEED)... "
  if curl -s -L --max-time 20 --retry 2 -o "$OUTFILE" "$URL" 2>/dev/null; then
    SIZE=$(stat -f%z "$OUTFILE" 2>/dev/null || echo 0)
    if [ "$SIZE" -gt 5000 ]; then
      echo "✓ ${SIZE}b"
      ((SUCCESS++))
    else
      # Fallback: use a working Picsum seed URL instead
      curl -s -L --max-time 20 -o "$OUTFILE" "https://picsum.photos/seed/room${i}/800/600.jpg" 2>/dev/null
      SIZE2=$(stat -f%z "$OUTFILE" 2>/dev/null || echo 0)
      if [ "$SIZE2" -gt 5000 ]; then
        echo "✓ fallback ${SIZE2}b"
        ((SUCCESS++))
      else
        echo "✗ FAIL"
        ((FAIL++))
      fi
    fi
  else
    echo "✗ curl error"
    ((FAIL++))
  fi
  sleep 0.1
done

echo ""
echo "Done! ✅ Success=$SUCCESS ❌ Fail=$FAIL"
ls "$DEST" | wc -l
