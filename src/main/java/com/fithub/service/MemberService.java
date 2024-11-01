package com.fithub.service;

import com.fithub.dto.MemberDTO;
import com.fithub.model.Member;
import com.fithub.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class MemberService {
    private final MemberRepository memberRepository;

    public Page<Member> getAllMembers(Pageable pageable) {
        return memberRepository.findAll(pageable);
    }

    public Member getMemberById(Long id) {
        return memberRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Member not found"));
    }

    @Transactional
    public Member createMember(MemberDTO memberDTO) {
        Member member = Member.builder()
            .name(memberDTO.getName())
            .email(memberDTO.getEmail())
            .phone(memberDTO.getPhone())
            .membershipType(memberDTO.getMembershipType())
            .status(memberDTO.getStatus())
            .joinDate(memberDTO.getJoinDate())
            .membershipExpiry(memberDTO.getMembershipExpiry())
            .photo(memberDTO.getPhoto())
            .build();
        
        return memberRepository.save(member);
    }

    @Transactional
    public Member updateMember(Long id, MemberDTO memberDTO) {
        Member member = getMemberById(id);
        
        member.setName(memberDTO.getName());
        member.setEmail(memberDTO.getEmail());
        member.setPhone(memberDTO.getPhone());
        member.setMembershipType(memberDTO.getMembershipType());
        member.setStatus(memberDTO.getStatus());
        member.setMembershipExpiry(memberDTO.getMembershipExpiry());
        member.setPhoto(memberDTO.getPhoto());
        
        return memberRepository.save(member);
    }

    @Transactional
    public void deleteMember(Long id) {
        memberRepository.deleteById(id);
    }
}