{
  description = "Save media & music to various sources.";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    utils.url = "github:numtide/flake-utils";
    utils.inputs.nixpkgs.follows = "nixpkgs";
  };

  outputs = { self, nixpkgs, utils, ... }@inputs:
    utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs {
          config.allowUnfree = true;
          inherit system;
        };
        tex = pkgs.texlive.combine {
          inherit (pkgs.texlive) scheme-full latex-bin latexmk;
        };
        nodejs = pkgs.nodejs-18_x;
        node2nixOutput = import ./nix { inherit pkgs nodejs system; };
        nodeDeps = node2nixOutput.nodeDependencies;
      in rec {
        devShells.default = pkgs.mkShell rec {
          name = "msave";
          packages = with pkgs; [
            nodejs node2nix 
            nodeDeps
            #nodePackages.web-ext
          ];
        };
        packages = {
          default = packages.msave;
          msave = with pkgs;
            stdenv.mkDerivation rec {
              pname = "msave";
              version = "0.1";

              src = builtins.path {
                name = pname;
                path = ./.;
                filter = path: type:
                  !builtins.elem (/. + path) [
                    ./docs
                    ./nix
                  ];
              };


              buildInputs = [ nodejs ];

              buildPhase = ''
                runHook preBuild
                ln -sf ${nodeDeps}/lib/node_modules ./node_modules
                export PATH="${nodeDeps}/bin:$PATH"
                npm run build
                runHook postBuild
              '';

              installPhase = ''
                runHook preInstall
                mkdir -p $out/bin
                cp package.json $out/package.json
                cp -r build $out/build
                cp src/manifest.json $out/build
                ln -sf ${nodeDeps}/lib/node_modules $out/node_modules
                runHook postInstall
              '';

              meta = with lib; {
                homepage = "https://github.com/xdHampus/msave";
                description = ''
                  Save media & music to various sources.
                '';
                licencse = licenses.lgpl3Plus;
                platforms = platforms.all;
                maintainers = [ maintainers.xdHampus ];
              };
            };
          msave-docs = pkgs.callPackage ./docs/default.nix {
            pkgs = pkgs;
            tex = tex;
          };
        };
      });
}
