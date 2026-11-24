# Third-party data notices

This project includes a selection of frequency data from the NKJP list and dictionary-derived Polish forms. The original source archives are excluded from the repository and deployment; the derived JSON used by the app remains included. This notice ships with the static site.

## NKJP frequency data

The rank and frequency fields in `core-vocabulary-100.json` were selected from `nkjp-frekwencja.csv` in [KubaCiolo/leksjo-dane](https://github.com/KubaCiolo/leksjo-dane). That file is attributed there to the manually annotated one-million-word subcorpus of the National Corpus of Polish (NKJP 1.2) and is distributed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). This project selected the first 100 alphabetic lemmas and added educational glosses and other app data. See the [upstream licence and attribution](https://github.com/KubaCiolo/leksjo-dane/blob/main/LICENSE.md).

## PoliMorf dictionary forms

Forms and grammatical tags in the app's JSON were extracted from the user-supplied `polimorf-20261018.tab.gz`. The archive identifies itself as `pl.waw.ipipan.polimorf-2026.10.19` and contains the following notice:

> Portions copyright © 2011 Marek Futrega, Piotr Gackiewicz, Mirosław Prywata,
> Włodzimierz Macewicz, Marcin Miłkowski
>
> Portions copyright © 2007–2026 Zygmunt Saloni, Włodzimierz Gruszczyński, Witold Kieraś, Marcin Woliński, Robert Wołosz, Danuta Skowrońska
>
> Portions copyright © 2011–2026 Institute of Computer Science, Polish Academy of Sciences
>
> All rights reserved.
>
> Redistribution and use in source and binary forms, with or without
> modification, are permitted provided that the following conditions are
> met:
>
> Redistributions of source code must retain the above copyright notice,
> this list of conditions and the following disclaimer.
> Redistributions in binary form must reproduce the above copyright
> notice, this list of conditions and the following disclaimer in the
> documentation and/or other materials provided with the distribution.
>
> THIS SOFTWARE IS PROVIDED BY COPYRIGHT HOLDERS “AS IS” AND ANY EXPRESS
> OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
> WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
> DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDERS OR CONTRIBUTORS BE
> LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
> CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
> SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
> INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
> CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
> ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF
> THE POSSIBILITY OF SUCH DAMAGE.

The [PoliMorf project page](https://zil.ipipan.waw.pl/PoliMorf) describes the dictionary's two-clause BSD licence. The app's teaching notes and English glosses are separate educational content and have not had independent native-speaker review.
