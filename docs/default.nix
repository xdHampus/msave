{ lib, stdenvNoCC, pkgs, tex }:

let

  init-design = pkgs.callPackage ./init/default.nix { tex = tex; };

in stdenvNoCC.mkDerivation rec {
  pname = "msave-docs";
  version = "0.1";

  src = ./.;

  installPhase = ''
    mkdir -p $out
    cp ${init-design}/* $out/
  '';

  meta = with lib; {
    homepage = "https://github.com/xdHampus/nixtemplates";
    description = ''
      Documentation for msave.
    '';
    licencse = licenses.mit;
    platforms = platforms.all;
    maintainers = with maintainers; [ xdHampus ];
  };
}
