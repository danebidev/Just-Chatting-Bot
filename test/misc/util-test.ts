import { expect } from "chai";
import { describe } from "mocha";
import { getIdByMention, getSHA256Checksum } from "../../src/misc/util";

describe("util", () => {

	describe("#getIdByMention()", () => {

		it("should return the mention id", () => {
			expect(getIdByMention("<@012345678910111213>")).to.equal("012345678910111213");
			expect(getIdByMention("<@131211109876543210>")).to.equal("131211109876543210");
		});

		it("should work with exclamation marks", () => {
			expect(getIdByMention("<@!012345678910111213>")).to.equal("012345678910111213");
			expect(getIdByMention("<@!131211109876543210>")).to.equal("131211109876543210");
		});

		it("should return null with invalid ids", () => {
			expect(getIdByMention("<@01234567891011121>")).to.equal(null);
			expect(getIdByMention("<@0134232>")).to.equal(null);
			expect(getIdByMention("<@4636453453463424f>")).to.equal(null);
			expect(getIdByMention("<@?131211109876543210>")).to.equal(null);
		});

	});

	describe("#getSHA256Checksum()", () => {

		const longString1 = "H*5srhD44R%BcMd-!Zf2@-u=z3Q?pt5$^qv4jF@^LVh2hrk9!%ep_U$hs5L@C#NX24g&*6VkutK36HxpTQc&tj4UV^4as+beTn+erMvTEaUDpEk7nG!%mkDEYa?SK^h+#5t+VQVQXsn8*m6!b2YVsW8Rr6?v#k+@3Gwshc-g%WZ_eVN4@m2w9?+JxRxeBnQKA*s9*KxcB&qERSjn@SdsPL=^sQYrBU7Nat$Kg%3U9-s9MTjyPKxR^4Re!MF#Cp+FAUfjE^svnEZCer*WjQBL%%^TP6GD*WkTC9Ks74BCLE_bt!zs%bE@U2gzKERB?h+@huAkpeUwX+=qnZ$HV!gUHVbY8Tr$$Bttx%u4pya6qYgCG5Ue?NU@P8+5yZw_xLG-qGrkF+w6wU!SQfcx&_D=j$M$t74w^*G?T7mJFAnmKa39VLpVmL&!hf9DZe#zsdpeet7VJHh39P9!LP+2bghzFK4^4Z@=3jdAw$+NYU%Z6CsX%GSSbFtKy4tXu6yvC7kN_8Qt7*$E%HmcCNKV9AH!RrrfG$%kd#xuvHk%ZBpGbUgeTjV3TCu+QYMh_HbVJVJRxB^JzT8UM#!sxA#8tEvFV_=-YN$?emSgN9$AdRWjHbT%$nTa&ExtSZUC45PQTeJrSnsZ^wWcr+J7M8u_-FCsXV4$qhEjb3NTeaS^9qYdY+Yaj-2NKAm7a8Zj5E@bHwN!M@7Kpt3kPs2Ye%gtvNSD&DNsL=hrkB*@W2#ZU9_U=$!U#PCXf3e^ZQ4NzVSTamXBwqv3fD6ZYHKvAzjZC**qy4M#3Gmgn4p_Jzk*LWH287zxxKwFMEXLz66+@r5v8=GFnr+Bt^X+eR6WF==bhnB*fjU^WXG4qxzsufbfc%$5_7dGhvSuSxwUgxGCjjG&EGcT-Q!AZeyjzdfqs9%x%qJRH%#VEan-@W5BrkBcatz3wCTK@RYC^mWG=df-GpSaxEEZ%jx7znmsquk+dBZMBD+g?Pjc%NAw$&kF-?dA+KwJfC?A=qpwH%=6MR=uj-bCsrFyKHBN2_SdN&m$KTta9?NN26nHRcjp=5KsYRnQ3gt%9$JYPV52#eqZj!@NAnPN%_eakU!jM^pT7m@kZy*2yBG#DsU9pGzjM-5GcYtMrvDkb*6_d4j@ctvgzd?ZNK*yHMRN9ghb7f!Q*QLg#&fgSMnK-!#93C3mAkZ_Hr_cVQHHKXrtTmEP8qY?Rt3+gc=V6#H94zDt$=L22ZpGHcUVLFrTQWexDRbJtQ6VT36hx8$y8U9-cDpaxqFLkUm3qy^fcHYY#RPWHmZTBhBQ+Js@GF*_M_g=3NArd%69fhANsA7Eg%9^h@CufYes#=N2K^uL3xAYsc=wvRwWuaP##ZJju%e^J2=szuU4RmAK%6GZWFcS%kwnSt4Xgt+gar^sxyx^?xH3#n9S9HUJPzx+G^!%nVEdUM8_Cg+_tjHjL*8mpg!jz!&&G%mqV-NXUvD-Gg*rrQyEtXCUax9r=teaG+Y@G=U573%wAbCy!c$uyv3db^^xp4jg^kv6gQYWpPtGx6xpeJu7CC^ejRvAncpB=8a7A7ds6Lgg%Cx^tAV-cexC@2V87S+KjhadqvdjCe&ywMLNh6@8cHxdUU=_NM9&t_24brdSQ%?zw8QSB3TkB8naU^bk89WRyvaGtvz45_YcU$PXt6c&k%q%gh&nt%&+Hq_s-a4!KwVJ3CvLuD^6CSuz5tZBSHPLv_C!jDFhk9Zy_vK!79HuSRgYrqw=fKAkyS=&C=yBYYZgALDemqFG$SfZQ9A4FxLc@5mU@WeZ^Y@Qd-dca$d8QL5t+-4XmW!*+n*R2zTq2_?cMmynyFtfNyB3&P6@JAcM9GBenUuGxup?A?r=7!khZQbMyGFBZjD+bp7E_pq%9&EngqQ?bW?dsmU%-QKv^^qc_rve_hw?qpb7w6ye+CU7YWbnY!-mDCz=L@6GBQnzh=cW?-FszGUMpxEKdnPZL7Nb5N5-f@?k_C5cTKe!@#smud4YMs@^m99f2MEd6EzkBsXGNX5h77ahandCwLq?fkVv@^R7MkhyYzr=NZaxL9#@";
		const longString2 = "_HdjZYrbX4Z-tEH$M?$4AmwPzdYQu8VBFMa_ddyVg2vEChY+-DSkD_uGDp6mna+yy&J^^#_yTC!@8mJE%k2t@V&qEeJq%PZtPnFh=kcGLDKAFT74FC3Kc2eE3=5a2nAVCYqXRvVfFK3kscyq%P4kMzeQMaJ^7vPwnUYXh#@a#fYMeh=mKs__PddtFvdbL=A-Ab83BgZ%saVW_@MLVP7JkG+teadM*!tH9&aN6x8RG-9FMDXPzDP5uyA2bA?B=WUU&X76epW^eF@mf#Cc4BNA94qqJjsTG$FkkhXFSHEKnVN2V6=B*&J-xhqWfd_^G33+w@&BVB=%rJAa2-69Z6Ms85kW-^*3dC$ze#H$V8XHmRVUWNme3P&vnM&2aEp?2K=JA#mB?pDSj!5Pjq#h7f+hNHWLBw?@%w^tY8XvGU?A5Unu$kpCZ3M6MUcEYVqM=?=AV3ThUNhe=PJFLmkgwDc&tjDGQLZqeH6bs8Cjy-H$54mTt$e#S9d2WXTW*NSW_Bzgve66Y9NdD!LVUt_y+cD2as^%FEwDu6rV@*u%vyuc*uBsg2MSsRYTW=CjF#&8S*fbUYgfparM!#h2H$-*=+&g-u7Ns$?Vnk6zE6HtXr2Ea$CcM6PgUujpTEYeqF-hck2#xQ+*WbZ4nx2YddTCsPdLBUsUATk_McD@-b!pAFYxLYXGmMkz4zBFgH6@K-g3b?F^NV+svAvX&3mz$CpZh7xfE5BmB5b^VAWUjg7ZjE#7-kuq%pwz?@pN92ff2!%3zVYzAY2R8876%bz8^9^M4qaPMuG3pp&@6YxT!S!*WG4=n-?kE_q2Fyr#vgMwD3SfgM*4EUbQZKpm3fQC#5#6fJbURvbgAcPPG$+dSG$Y8p5Nrhktkrq!$umBF6?Awn_&_a9#nEd5jERnAt@ryJwJgaUqWM&hbHvdwMMr5PxpF3B*TquTnm3fehmJ^-V2mhL@HMM$!d&aBF3utPg2KPC6tgSNvzMrtaX+seVSK$bsC8G$EPP!assm3#pYZR!&5Qt3rwsVruNf8_fE-PRNn@ZTTcakfeh=?e+jrtu%ty_$j97n2#Mt^ENvWnH-uJa785JNKH+?eV7LbYe*n@JthZ4T4sT%zm^HXTRj55g-@axM?Gup2ejkC^Tuq@Kn#vjEPdR*zmufq4%2VKS*x$YcuCV?#xzQ#y4W7QhJWWhbs=65f2EGGyUX$-YyBtFvpDLDzJNm7+c%e2s-YGLdJAcUfPtdWc2btbSLgrK@jR=X_MT+nwBeNMfPD4#?+?aF_@wa^4c5sQV3$WqDQ3@SDmc?^8qLY!8Gd9XPDn#5cG_h2KVRJc^*E8SqTS$Wq78s_hq#YKKaxe4n5h7_VM#y_HvW3_Y%PB36%TJQNT%cSh-av?d#udmdT_ctKGFgx6+Ce3$u@ensX@%!HgAqTsC5Pc7ysrEdKvs6SdFA-8$&aHt4-PqB9Hvk$cAKrQuBh48@r6SvG4zZr^yje%U@!?R!@mxwbXJgYLgU?_5RkHMHB99BtNMQ5M=DKF=+WR^8E-LT?RwT+F879ankwmEg963fKn_^m7jM?=$mdZcVnpQjpStRRY%gLxeuGSUw9@NctknHUGaputsq&=M5Cw&Wj!+krLJn$RaVEbHE8t!9Xw&sjUpv3Sk-btdSkj=UQ_c*NZ5KmSZGP6p^wP!nNWyTd33H4M5Fj7*JkDVubySfJpS9vpMrD%x#XJayWM7@Ga#*C&BUF9W-pq9uuG_hUpxN2R-uwek=wCEsu+PYqxL+DED5z!_f_WvwmT7CN=7$=z*^Fp=rD*jwL+Pv%J_89Pp922^NX!9gUnSym&+6-dYS4zyanEfyFmUBW5&HCrzyJq4$zvp??Ms-V6q@J*p4rKE-MEGJ^sqVHXm_YwTTP2v%NRcYBsdTUezQ8Dba2WF#!3FTL3fW!WmW&#9k_nRA4cz5EE62sRca+!cL?eNVmch_Fepdce%eAwu4$xD*zP&fsS?NY6x-Qs--%hs6T5956+KJ4dGh=-^hxcanwXE8%=!D#gg--mqEY=m4Yq%hSA5t5wM#&&Z$+M7@XGt!CTrQ";

		it("should work normal length inputs", () => {
			expect(getSHA256Checksum("abc")).to.equal("ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad");
			expect(getSHA256Checksum("abcdbcdecdefdefgefghfghighijhijkijkljklmklmnlmnomnopnopq")).to.equal("248d6a61d20638b8e5c026930c3e6039a33ce45964ff2167f6ecedd419db06c1");
			expect(getSHA256Checksum("abcdefghbcdefghicdefghijdefghijkefghijklfghijklmghijklmnhijklmnoijklmnopjklmnopqklmnopqrlmnopqrsmnopqrstnopqrstu")).to.equal("cf5b16a778af8380036ce59e7b0492370b249b11e8f07a51afac45037afee9d1");
		});

		it("should work with long inputs", () => {
			expect(getSHA256Checksum(longString1)).to.equal("2c42d60919c2d174140eb02977db366e09c3c485930c01805bb0ce7f1c90b76d");
			expect(getSHA256Checksum(longString2)).to.equal("857275a28eee35945b872186fb92d76448c0a58fcf1c36a34372b741b7039315");
		});

		it("should work with empty inputs", () => {
			expect(getSHA256Checksum("")).to.equal("e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855");
		});

	});

});