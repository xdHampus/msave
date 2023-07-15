node2nix -18 --development \
    --input package.json \
    --lock package-lock.json \
    --node-env ./nix/node-env.nix \
    --composition ./nix/default.nix \
    --output ./nix/node-package.nix
