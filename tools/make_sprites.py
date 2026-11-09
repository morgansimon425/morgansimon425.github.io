"""Build the placeholder pixel-art sprites in ../assets as SVG files.

Each sprite is a grid of characters; every character maps to a color in the
sprite's palette and "." is transparent. Edit a grid, then run:

    python3 tools/make_sprites.py

To use real pixel art instead, drop a PNG into assets/ with the same name
(or change the <img src> in index.html).
"""
from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / "assets"
OUT.mkdir(exist_ok=True)

COMMON = {
    "O": "#5A4752",  # soft outline
    "K": "#3B2F3A",  # eyes
    "W": "#FFFFFF",
    "w": "#EFE6EC",  # white shading
    "P": "#F7A8C4",  # pink
    "p": "#F28DB2",
    "R": "#E5484D",  # holiday red
    "r": "#B93A3F",
    "G": "#4FA36B",  # pine green
    "g": "#3B8656",
    "Y": "#F5C451",  # gold
    "y": "#E0A93A",
    "T": "#8A5A3B",  # trunk / cocoa brown
    "t": "#6E4630",
    "B": "#8CC8F0",  # light blue
    "M": "#CFEBD9",  # mint
}

SPRITES = {
    "bunny": [
        "...OO......OO...",
        "..OWWO....OWWO..",
        "..OWPO....OPWO..",
        "..OWPO....OPWO..",
        "..OWPO....OPWO..",
        "..OWWO....OWWO..",
        "..OWWWOOOOWWWO..",
        ".OWWWWWWWWWWWWO.",
        "OWWWWWWWWWWWWWWO",
        "OWWKKWWWWWWKKWWO",
        "OWWKKWWWWWWKKWWO",
        "OWPPWWWOOWWWPPWO",
        "OwWWWWWWWWWWWWwO",
        ".OwwWWWWWWWWwwO.",
        "..ORRRRRRRRRRO..",
        ".ORrRRRRRRRRrRO.",
        "..OWWWWWWWORrO..",
        "..OOOOOOOOOOOO..",
    ],
    "tree": [
        ".....Y.....",
        "....YYY....",
        ".....G.....",
        "....GgG....",
        "...GGRGG...",
        "....gGg....",
        "...GgGGgB..",
        "..GGGgGGGG.",
        "...YgGGgG..",
        "..GGgGGRgG.",
        ".GGGGBgGGGG",
        "GGGgGGGGgYG",
        "....TTT....",
        "....TTT....",
    ],
    "present": [
        "...PP..PP...",
        "..P..PP..P..",
        "...PPPPPP...",
        "OOOOOPPOOOOO",
        "ORRRRPPRRRRO",
        "ORRRRPPRRRRO",
        "OPPPPPPPPPPO",
        "ORRRRPPRRRRO",
        "ORRRRPPRRRRO",
        "OrrrrPPrrrrO",
        "OOOOOOOOOOOO",
    ],
    "cocoa": [
        "...W..W.....",
        "....W..W....",
        "...W..W.....",
        "OOOOOOOOOO..",
        "OWWWWWWWWOOO",
        "OTTTWTTTTO.O",
        "OPPPPPPPPO.O",
        "OPWPPWPPPOOO",
        "OPPPPPPPPO..",
        ".OPPPPPPO...",
        "..OOOOOO....",
    ],
    "star": [
        "....Y....",
        "....Y....",
        "...YYY...",
        "YYYYWYYYY",
        ".YYYYYYY.",
        "..YYYYY..",
        "..YY.YY..",
        ".YY...YY.",
        ".Y.....Y.",
    ],
}


def to_svg(name, grid, palette):
    w = len(grid[0])
    for row in grid:
        assert len(row) == w, f"{name}: row width {len(row)} != {w}: {row!r}"
    h = len(grid)
    rects = []
    for y, row in enumerate(grid):
        x = 0
        while x < w:  # merge runs of the same color into one rect
            ch = row[x]
            run = 1
            while x + run < w and row[x + run] == ch:
                run += 1
            if ch != ".":
                rects.append(f'<rect x="{x}" y="{y}" width="{run}" height="1" fill="{palette[ch]}"/>')
            x += run
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" '
        f'width="{w * 8}" height="{h * 8}" shape-rendering="crispEdges">'
        + "".join(rects)
        + "</svg>\n"
    )


for name, grid in SPRITES.items():
    (OUT / f"{name}.svg").write_text(to_svg(name, grid, COMMON))
    print("wrote", name)
